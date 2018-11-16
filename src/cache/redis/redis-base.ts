import { Cache, Pipeline, ScanOptions } from "../cache";
import IORedis from "ioredis";
import { Is } from "../../constants";
import * as _ from "../../utilities";
import { CacheHelper } from "../helper";
import { Omit } from "lodash";

abstract class RedisBase implements Cache {

    private _redis: IORedis.Redis;
    protected get redis(): IORedis.Redis {
        return this._redis;
    }

    constructor(redis: IORedis.Redis) {
        this._redis = redis;
    }

    public async ping(): Promise<string> {
        return await this._redis.ping();
    }

    public disconnect(): void {
        this._redis.disconnect();
    }

    public async get(key: string): Promise<string | null | undefined> {
        return await this._redis.get(key);
    }

    public async getBuffer(key: string): Promise<Buffer> {
        return await this._redis.getBuffer(key);
    }
    
    public async pexpire(key: string, milliseconds: number): Promise<Is> {
        return await this._redis.pexpire(key, milliseconds);
    }
    public async mgetBuffer(...keys: string[]): Promise<Buffer[]> {
        return await (this._redis as any).mgetBuffer(...keys);
    }
    
    public async psetex(key: string, milliseconds: number, value: any): Promise<string> {
        return await this._redis.psetex(key, milliseconds, value);
    }

    public async set(key: string, value: any, ...args: any[]): Promise<string> {
        return await this._redis.set(key, value, args);
    }

    public async mset(...keyValuePairs: [string, any][]): Promise<string> {
        const result = CacheHelper.convertKeyValuePairsToFirstRest(keyValuePairs);
        if (result) {
            return await this._redis.mset(result.first["0"], result.first["1"], ...result.rest);
        }
        else {
            return "OK";
        }
    }

    public async del(...keys: string[]): Promise<number> {
        return await this._redis.del(...keys);
    }

    public scanStream(options?: ScanOptions): NodeJS.EventEmitter {
        return this._redis.scanStream(options);
    }

    protected static scanInternal(redis: IORedis.Redis, options?: ScanOptions): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            const keys: string[] = [];
            const stream = redis.scanStream(options);
            stream.on("data", (data: string[]) => {
                for (const key of data) {
                    keys.push(key);
                }
            });
            stream.on("error", error => {
                return reject(error);
            });
            stream.on("end", () => {
                return resolve(keys);
            });
        });
    }

    public async scan(options?: ScanOptions): Promise<string[]> {
        return RedisBase.scanInternal(this._redis, options);
    }

    protected static async clearInternal(redis: IORedis.Redis): Promise<string> {
        return await redis.flushall();
    }

    public async clear(): Promise<string> {
        return await RedisBase.clearInternal(this._redis);
    }

    public multi(): Pipeline {
        return new RedisPipeline(this._redis.multi());
    }

    public async sadd(key: string, ...members: any[]): Promise<number> {
        return await this._redis.sadd(key, ...members);
    }

    public async srem(key: string, ...members: any[]): Promise<number> {
        return await this._redis.srem(key, ...members);
    }

    public async smembers(key: string): Promise<any[]> {
        return await this._redis.smembers(key);
    }
}

class RedisPipeline implements Pipeline {

    private _multi: IORedis.Pipeline;

    constructor(multi: IORedis.Pipeline) {
        this._multi = multi;
    }


    public pexpire(key: string, milliseconds: number): void {
        this._multi.pexpire(key, milliseconds);
    }
    
    public mset(...keyValuePairs: [string, any][]): void {
        const result = CacheHelper.convertKeyValuePairsToFirstRest(keyValuePairs);
        if (result) {
            this._multi.mset(result.first["0"], result.first["1"], ...result.rest);
        }
    }

    public async exec(): Promise<any> {
        return await this._multi.exec();
    }


}

export { RedisBase, RedisPipeline, };