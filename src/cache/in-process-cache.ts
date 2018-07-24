import * as _ from "../utilities";
import { ICache } from "./i-cache";
import { CacheKey } from "./cache-key";

export default class InProcessCache implements ICache {

    private _prefix: string;

    private _map: Map<string, any>;
    public get map(): Map<string, any> {
        return this._map;
    }

    constructor(prefix: string) {
        this._prefix = prefix;
        this._map = new Map<string, any>();
    }

    public async getByKey<TValue>(key: CacheKey, expireInMilliseconds?: number): Promise<TValue | undefined> {
        return this._map.get(key.toString(this._prefix));
    }

    public async getByKeys<TValue>(keys: CacheKey[], expireInMilliseconds?: number): Promise<(TValue | undefined)[]> {
        return _.chain(keys).map(x => this._map.get(x.toString(this._prefix))).filter(x => !_.isEmpty(x)).valueOf();
    }

    public async setByEntity<TValue>(entity: TValue, keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey | undefined> {
        const key = keyResolver(entity);
        this._map.set(key.toString(this._prefix), entity);
        return key;
    }

    public async setByEntities<TValue>(entities: TValue[], keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey[]> {
        const keys: CacheKey[] = [];
        for (const entity of entities) {
            const key = keyResolver(entity);
            this._map.set(key.toString(this._prefix), entity);
            keys.push(key);
        }
        return keys;
    }

    public async deleteByKey(key: CacheKey): Promise<void> {
        this._map.delete(key.toString(this._prefix));
    }

    public async deleteByKeys(keys: CacheKey[]): Promise<void> {
        for (const key of keys) {
            this._map.delete(key.toString(this._prefix));
        }
    }

    public async deleteByPattern(pattern: CacheKey): Promise<void> {
        const patternValue = pattern.toPattern().split(`*`).join(``);
        for (const key of this._map.keys()) {
            if (key.startsWith(patternValue)) {
                this._map.delete(key);
            }
        }
    }

    public async clear(): Promise<void> {
        this._map.clear();
    }
}