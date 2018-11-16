/// <reference types="node" />
/// <reference types="mocha" />
import { Cache, Pipeline, ScanOptions } from "../cache";
import IORedis from "ioredis";
import { Is } from "../../constants";
declare abstract class RedisBase implements Cache {
    private _redis;
    protected readonly redis: IORedis.Redis;
    constructor(redis: IORedis.Redis);
    ping(): Promise<string>;
    disconnect(): void;
    get(key: string): Promise<string | null | undefined>;
    getBuffer(key: string): Promise<Buffer>;
    pexpire(key: string, milliseconds: number): Promise<Is>;
    mgetBuffer(...keys: string[]): Promise<Buffer[]>;
    psetex(key: string, milliseconds: number, value: any): Promise<string>;
    set(key: string, value: any, ...args: any[]): Promise<string>;
    mset(...keyValuePairs: [string, any][]): Promise<string>;
    del(...keys: string[]): Promise<number>;
    scanStream(options?: ScanOptions): NodeJS.EventEmitter;
    protected static scanInternal(redis: IORedis.Redis, options?: ScanOptions): Promise<string[]>;
    scan(options?: ScanOptions): Promise<string[]>;
    protected static clearInternal(redis: IORedis.Redis): Promise<string>;
    clear(): Promise<string>;
    multi(): Pipeline;
    sadd(key: string, ...members: any[]): Promise<number>;
    srem(key: string, ...members: any[]): Promise<number>;
    smembers(key: string): Promise<any[]>;
}
declare class RedisPipeline implements Pipeline {
    private _multi;
    constructor(multi: IORedis.Pipeline);
    pexpire(key: string, milliseconds: number): void;
    mset(...keyValuePairs: [string, any][]): void;
    exec(): Promise<any>;
}
export { RedisBase, RedisPipeline, };
