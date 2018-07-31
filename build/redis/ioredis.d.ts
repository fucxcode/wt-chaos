/// <reference types="node" />
/// <reference types="mocha" />
import { Redis, Pipeline, ScanOptions } from "./redis";
import * as ioredis from "ioredis";
import { is } from "../constants";
declare class RedisHelpers {
    static convertKeyValuePairsToFirstRest(keyValuePairs: [string, any][]): {
        first: [string, any];
        rest: any[];
    } | undefined;
}
declare class IORedis implements Redis {
    private _redis;
    constructor(redis: ioredis.Redis);
    getBuffer(key: string): Promise<Buffer>;
    pexpire(key: string, milliseconds: number): Promise<is>;
    mgetBuffer(...keys: string[]): Promise<Buffer[]>;
    psetex(key: string, milliseconds: number, value: any): Promise<string>;
    set(key: string, value: any, ...args: any[]): Promise<string>;
    mset(...keyValuePairs: [string, any][]): Promise<string>;
    del(...keys: string[]): Promise<number>;
    scanStream(options?: ScanOptions): NodeJS.EventEmitter;
    scan(options?: ScanOptions): Promise<string[]>;
    clear(): Promise<string>;
    multi(): Pipeline;
    sadd(key: string, ...members: any[]): Promise<number>;
    srem(key: string, ...members: any[]): Promise<number>;
    smembers(key: string): Promise<any[]>;
}
declare class IORedisPipeline implements Pipeline {
    private _multi;
    constructor(multi: ioredis.Pipeline);
    pexpire(key: string, milliseconds: number): void;
    mset(...keyValuePairs: [string, any][]): void;
    exec(): Promise<any>;
}
export { IORedis, IORedisPipeline, RedisHelpers };
