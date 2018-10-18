"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_base_1 = require("./redis-base");
const ioredis_1 = __importDefault(require("ioredis"));
const _ = __importStar(require("../utilities"));
// some methods in this class just simply split keys and send them in parallel
// so that they can be addressed by the correct cluster nodes
// but in the future we may need to calculate the target node based on each key
// and send them together to reduce the network transactions
class RedisCluster extends redis_base_1.RedisBase {
    constructor(nodes, options) {
        super(new ioredis_1.default.Cluster(nodes, options));
    }
    nodes(role) {
        const cluster = this.redis;
        return cluster.nodes(role);
    }
    async mgetBuffer(...keys) {
        return await Promise.all(_.map(keys, key => this.getBuffer(key)));
    }
    async mset(...keyValuePairs) {
        await Promise.all(_.map(keyValuePairs, kvp => {
            return this.set(kvp[0], kvp[1]);
        }));
        return "OK";
    }
    async del(...keys) {
        return _.sum(await Promise.all(_.map(keys, key => super.del(key))));
    }
    async scan(options) {
        const nodes = await this.nodes("master");
        const keysArray = await Promise.all(_.map(nodes, node => redis_base_1.RedisBase.scanInternal(node, options)));
        return _.flatten(keysArray);
    }
    async clear() {
        const nodes = await this.nodes("master");
        const results = await Promise.all(_.map(nodes, node => redis_base_1.RedisBase.clearInternal(node)));
        return results.join(`\r\n`);
    }
    multi() {
        return new RedisClusterPipeline(this);
    }
}
exports.RedisCluster = RedisCluster;
// WARNING:
// in redis cluster, operations in a pipeline must based on the same node
// this means the implementation below does *NOT* guarantee transaction
// and only ensures the operations will be executed in the sequence they pushed
// it just provide the same interface so that no need to modify code when switching between cluster and non-cluster
class RedisClusterPipeline {
    constructor(cluster) {
        this._cluster = cluster;
        this._operations = [];
    }
    pexpire(key, milliseconds) {
        this._operations.push(() => this._cluster.pexpire(key, milliseconds));
    }
    mset(...keyValuePairs) {
        this._operations.push(() => this._cluster.mset(...keyValuePairs));
    }
    async exec() {
        const result = [];
        for (const operation of this._operations) {
            result.push(await operation());
        }
        return result;
    }
}
exports.RedisClusterPipeline = RedisClusterPipeline;
//# sourceMappingURL=redis-cluster.js.map