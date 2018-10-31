import * as _ from "../../../utilities";
import { EntityCacheHitRatioListener, EmptyEntityCacheHitRatioListener, EntityCacheHitRatioRecord } from "./entity-cache-hit-ratio-listener";
import { Serializer, BSONSerializer } from "../../../serializer";
import { EntityCacheKey } from "./entity-cache-key";
import { Cache } from "../../../cache";

interface Randomizer {

    random(lower?: number, upper?: number, floating?: boolean): number;

}

class DefaultRandomizer implements Randomizer {

    public random(lower?: number | undefined, upper?: number | undefined, floating?: boolean | undefined): number {
        return _.random(lower, upper, floating);
    }

}

class EntityCache {

    private _prefix: string;
    private _jitter: number;
    private _hitRatioListener: EntityCacheHitRatioListener;

    private _cache: Cache;
    protected get cache(): Cache {
        return this._cache;
    }

    private _serializer: Serializer<Buffer>;

    private _randomizer: Randomizer;

    constructor(cache: Cache,
        prefix: string = "",
        serializer: Serializer<Buffer> = new BSONSerializer(),
        randomizer: Randomizer = new DefaultRandomizer(),
        jitterInMilliseconds: number = 50,
        listener: EntityCacheHitRatioListener = new EmptyEntityCacheHitRatioListener()) {
        this._cache = cache;
        this._prefix = prefix;
        this._serializer = serializer;
        this._randomizer = randomizer;
        this._jitter = jitterInMilliseconds;
        this._hitRatioListener = listener;
    }

    protected generateKeyString(key: EntityCacheKey): string {
        return key.toString(this._prefix);
    }

    private generateExpirationWithJitter(expires: number | undefined): number {
        return expires ? (expires + this._randomizer.random(0, this._jitter, false)) : 0;
    }

    public async getByKey<TValue>(key: EntityCacheKey, expireInMilliseconds?: number): Promise<TValue | undefined> {
        const keyString = this.generateKeyString(key);
        const buffer = await this._cache.getBuffer(keyString);
        if (_.isEmpty(buffer)) {
            await this._hitRatioListener.miss(key);
        }
        else {
            await this._hitRatioListener.bingo(key);
            if (expireInMilliseconds) {
                await this._cache.pexpire(keyString, this.generateExpirationWithJitter(expireInMilliseconds));
            }
            return this._serializer.deserialize<TValue>(buffer);
        }
    }

    protected async onGetByKeys(keys: EntityCacheKey[], expire: number): Promise<Buffer[]> {
        const keysString = _.map(keys, x => this.generateKeyString(x));
        const buffers = await (this._cache as any).mgetBuffer(...keysString);
        if (expire) {
            const multi = this._cache.multi();
            for (const keyString of keysString) {
                multi.pexpire(keyString, expire);
            }
            await multi.exec();
        }
        return buffers;
    }

    public async getByKeys<TValue>(keys: EntityCacheKey[], expireInMilliseconds?: number): Promise<(TValue | undefined)[]> {
        if (_.some(keys)) {
            const expire = this.generateExpirationWithJitter(expireInMilliseconds);
            const buffers = await this.onGetByKeys(keys, expire);

            const records: EntityCacheHitRatioRecord[] = [];
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const result = buffers[i];
                records.push(new EntityCacheHitRatioRecord(key, !!result));
            }
            await this._hitRatioListener.trackMultiple(records);

            return _.chain(buffers)
                .filter(x => !_.isEmpty(x))
                .map(x => this._serializer.deserialize<TValue>(x))
                .valueOf();
        }
        else {
            return [];
        }
    }

    public async setByEntity<TValue>(entity: TValue, keyResolver: (v: TValue) => EntityCacheKey, expireInMilliseconds?: number): Promise<EntityCacheKey> {
        const key = keyResolver(entity);
        const keyString = this.generateKeyString(key);
        const value = this._serializer.serialize(entity);
        if (expireInMilliseconds) {
            const expire = this.generateExpirationWithJitter(expireInMilliseconds);
            await this._cache.psetex(keyString, expire, value);
        }
        else {
            await this._cache.set(keyString, value);
        }
        return key;
    }

    protected async onSetByEntities<TValue>(items: {
        key: string,
        value: Buffer,
        expire: number
    }[], setExpiration: boolean) {
        const keyValuePairs: [string, Buffer][] = [];
        for (const item of items) {
            keyValuePairs.push([item.key, item.value]);
        }
        if (setExpiration) {
            const multi = this._cache.multi();
            multi.mset(...keyValuePairs);
            for (const item of items) {
                multi.pexpire(item.key, item.expire);
            }
            await multi.exec();
        }
        else {
            await this._cache.mset(...keyValuePairs);
        }
    }

    public async setByEntities<TValue>(entities: TValue[], keyResolver: (v: TValue) => EntityCacheKey, expireInMilliseconds?: number): Promise<EntityCacheKey[]> {
        const keys: EntityCacheKey[] = [];
        if (_.some(entities)) {
            const items = _.map(entities, entity => {
                const key = keyResolver(entity);
                keys.push(key);
                return {
                    key: this.generateKeyString(key),
                    value: this._serializer.serialize(entity),
                    expire: this.generateExpirationWithJitter(expireInMilliseconds)
                };
            });
            await this.onSetByEntities(items, !!expireInMilliseconds);
        }
        return keys;
    }

    public async deleteByKey(key: EntityCacheKey): Promise<void> {
        await this._cache.del(this.generateKeyString(key));
    }

    public async deleteByKeys(keys: EntityCacheKey[]): Promise<void> {
        await this._cache.del(..._.map(keys, x => this.generateKeyString(x)));
    }

    public deleteByPattern(pattern: EntityCacheKey): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const keys: string[] = [];
            const stream = this._cache.scanStream({
                match: this.generateKeyString(pattern)
            });
            stream.on("data", data => {
                for (const key of data) {
                    keys.push(key);
                }
            });
            stream.on("error", error => {
                return reject(error);
            });
            stream.on("end", () => {
                if (_.some(keys)) {
                    this._cache.del(...keys);
                }
                return resolve();
            });
        });
    }

    public async clear(): Promise<void> {
        await this._cache.clear();
    }

}

export { EntityCache, Randomizer, DefaultRandomizer };