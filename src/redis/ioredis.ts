import { Redis, Pipeline, ScanOptions } from "./redis";
import * as ioredis from "ioredis";
import { is } from "../constants";
import * as _ from "../utilities";

class RedisHelpers {

    public static convertKeyValuePairsToFirstRest(keyValuePairs: [string, any][]): {
        first: [string, any],
        rest: any[]
    } | undefined {
        if (_.some(keyValuePairs)) {
            const first = _.first(keyValuePairs) as [string, any];
            const rest = _.chain(keyValuePairs)
                .tail()
                .map(x => [x["0"], x["1"]])
                .flatten()
                .valueOf();
            return {
                first: first,
                rest: rest
            };
        }
    }
}

class IORedis implements Redis {

    private _redis: ioredis.Redis;


    constructor(redis: ioredis.Redis) {
        this._redis = redis;
    }

    public async getBuffer(key: string): Promise<Buffer> {
        return await this._redis.getBuffer(key);
    }
    
    public async pexpire(key: string, milliseconds: number): Promise<is> {
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
        const result = RedisHelpers.convertKeyValuePairsToFirstRest(keyValuePairs);
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

    public scan(options?: ScanOptions): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            const keys: string[] = [];
            const stream = this.scanStream(options);
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

    public async clear(): Promise<string> {
        return await this._redis.flushall();
    }

    public multi(): Pipeline {
        return new IORedisPipeline(this._redis.multi());
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

class IORedisPipeline implements Pipeline {

    private _multi: ioredis.Pipeline;

    constructor(multi: ioredis.Pipeline) {
        this._multi = multi;
    }


    public pexpire(key: string, milliseconds: number): void {
        this._multi.pexpire(key, milliseconds);
    }
    
    public mset(...keyValuePairs: [string, any][]): void {
        const result = RedisHelpers.convertKeyValuePairsToFirstRest(keyValuePairs);
        if (result) {
            this._multi.mset(result.first["0"], result.first["1"], ...result.rest);
        }
    }

    public async exec(): Promise<any> {
        return await this._multi.exec();
    }


}

export { IORedis, IORedisPipeline, RedisHelpers };