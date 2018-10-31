import { RedisBase, RedisPipeline } from "./redis-base";
import IORedis from "ioredis";
import * as _ from "../../utilities";
import { ScanOptions, Pipeline } from "../cache";

// some methods in this class just simply split keys and send them in parallel
// so that they can be addressed by the correct cluster nodes
// but in the future we may need to calculate the target node based on each key
// and send them together to reduce the network transactions
class RedisCluster extends RedisBase {

    constructor(nodes: IORedis.ClusterNode[], options?: IORedis.ClusterOptions) {
        super(new IORedis.Cluster(nodes, options));
    }

    private nodes(role: "master" | "slave"): IORedis.Redis[] {
        const cluster: IORedis.Cluster = this.redis as any;
        return cluster.nodes(role);
    }

    public async mgetBuffer(...keys: string[]): Promise<Buffer[]> {
        return await Promise.all(_.map(keys, key => this.getBuffer(key)));
    }

    public async mset(...keyValuePairs: [string, any][]): Promise<string> {
        await Promise.all(_.map(keyValuePairs, kvp => {
            return this.set(kvp[0], kvp[1]);
        }));
        return "OK";
    }

    public async del(...keys: string[]): Promise<number> {
        return _.sum(await Promise.all(_.map(keys, key => super.del(key))));
    }

    public async scan(options?: ScanOptions): Promise<string[]> {
        const nodes = await this.nodes("master");
        const keysArray = await Promise.all(_.map(nodes, node => RedisBase.scanInternal(node, options)));
        return _.flatten(keysArray);
    }

    public async clear(): Promise<string> {
        const nodes = await this.nodes("master");
        const results = await Promise.all(_.map(nodes, node => RedisBase.clearInternal(node)));
        return results.join(`\r\n`);
    }

    public multi(): Pipeline {
        return new RedisClusterPipeline(this);
    }

}

// WARNING:
// in redis cluster, operations in a pipeline must based on the same node
// this means the implementation below does *NOT* guarantee transaction
// and only ensures the operations will be executed in the sequence they pushed
// it just provide the same interface so that no need to modify code when switching between cluster and non-cluster
class RedisClusterPipeline implements Pipeline {

    private _cluster: RedisCluster;

    private _operations: (() => Promise<any>)[];

    constructor(cluster: RedisCluster) {
        this._cluster = cluster;
        this._operations = [];
    }

    public pexpire(key: string, milliseconds: number): void {
        this._operations.push(() => this._cluster.pexpire(key, milliseconds));
    }

    public mset(...keyValuePairs: [string, any][]): void {
        this._operations.push(() => this._cluster.mset(...keyValuePairs));
    }

    public async exec(): Promise<any> {
        const result: any[] = [];
        for (const operation of this._operations) {
            result.push(await operation());
        }
        return result;
    }

}

export { RedisCluster, RedisClusterPipeline };