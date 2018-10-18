/// <reference types="node" />
import { RedisBase } from "./redis-base";
import IORedis from "ioredis";
import { ScanOptions, Pipeline } from "./redis";
declare class RedisCluster extends RedisBase {
    constructor(nodes: IORedis.ClusterNode[], options?: IORedis.ClusterOptions);
    private nodes;
    mgetBuffer(...keys: string[]): Promise<Buffer[]>;
    mset(...keyValuePairs: [string, any][]): Promise<string>;
    del(...keys: string[]): Promise<number>;
    scan(options?: ScanOptions): Promise<string[]>;
    clear(): Promise<string>;
    multi(): Pipeline;
}
declare class RedisClusterPipeline implements Pipeline {
    private _cluster;
    private _operations;
    constructor(cluster: RedisCluster);
    pexpire(key: string, milliseconds: number): void;
    mset(...keyValuePairs: [string, any][]): void;
    exec(): Promise<any>;
}
export { RedisCluster, RedisClusterPipeline };
