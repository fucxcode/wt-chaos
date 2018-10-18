import { Redis, RedisCluster, RedisBase } from "../src/redis";
import * as _ from "../src/utilities";
import IORedis from "ioredis";

(async () => {

    const nodes = [
        {
            host: `10.211.55.11`,
            port: 30001
        },
        {
            host: `10.211.55.11`,
            port: 30002
        },
        {
            host: `10.211.55.11`,
            port: 30003
        }
    ];

    const redis: Redis = new RedisCluster(nodes);
    
    const keyCount = 32768;
    const keys: string[] = [];
    for (let i = 0; i < keyCount; i++) {
        keys.push(i.toString());
    }

    // console.log(`mset`);
    // await redis.mset(...keys.map<[string, any]>(k => [k, k]));

    // console.log(`mget`);
    // const sampleKeys = _.sampleSize(keys, 100);
    // const result = await redis.mgetBuffer(...sampleKeys);
    // console.log(result.map(r => r.toString()));
    // console.log(result.length);

    // console.log(`del`);
    // const sampleKeys = _.sampleSize(keys, 100);
    // await redis.del(...sampleKeys);
    // const result = await redis.mgetBuffer(...sampleKeys);
    // console.log(result.length);

    // console.log(`scan`);
    // const pattern = "1****";
    // const result = await redis.scan({
    //     match: pattern
    // });
    // console.log(result.length);

    // console.log(`clear`);
    // console.log(await redis.clear());

    console.log(`pipeline`);
    const multi = redis.multi();
    for (const ks of _.chunk(keys, 100)) {
        multi.mset(...ks.map<[string, any]>(k => [k, k]));
    }
    const result = await multi.exec();
    console.log(result);

    // console.log(`set keys. length = ${keyCount}`);
    // for (let i = 0; i < keyCount; i++) {
    //     console.log(`set ${i}`);
    //     await redis.set(i.toString(), i);
    // }

    // console.log(`get keys. length = ${keyCount}`);
    // for (let i = 0; i < keyCount; i++) {
    //     const buf = await redis.getBuffer(i.toString());
    //     console.log(`get ${i} = ${buf.toString()}`);
    // }

    // const randomKeyCount = 10;
    // console.log(`mget keys. length = ${randomKeyCount}`);
    // const getKeys = _.sampleSize(keys, randomKeyCount);
    // // const result = await redis.mgetBuffer(...getKeys);
    // const result = await Promise.all(_.map(getKeys, k => redis.getBuffer(k)));
    // for (const buf of result) {
    //     console.log(buf.toString());
    // }
    // const cluster: IORedis.Cluster = redis.redis as any;
    // const ns = await cluster.nodes("master");
    // const result: string[] = [];
    // for (const n of ns) {
    //     const bufs: Buffer[] = await (n as any).mgetBuffer(...getKeys);
    //     const ks = bufs.map(x => x.toString());
    //     for (const k of ks) {
    //         result.push(k);
    //     }
    // }
    // console.log(result.length);
    // console.log(JSON.stringify(result, null, 2));

    // const pattern = "1000**";
    // const ks = await redis.scan({
    //     match: pattern
    // });
    // console.log(ks.length);
    // console.log(JSON.stringify(ks, null, 2));

    // const cluster: IORedis.Cluster = redis.redis as any;
    // const ns = await cluster.nodes("master");
    // const r = await Promise.all(ns.map(n => {
    //     return new Promise<string[]>((resolve, reject) => {
    //         const keys: string[] = [];
    //         const stream = n.scanStream({
    //             match: pattern
    //         });
    //         stream.on("data", (data: string[]) => {
    //             for (const key of data) {
    //                 keys.push(key);
    //             }
    //         });
    //         stream.on("error", error => {
    //             return reject(error);
    //         });
    //         stream.on("end", () => {
    //             return resolve(keys);
    //         });
    //     });
    // }));
    // console.log(r);
    // const all = _.flatten(r);
    // console.log(all.length);

    redis.disconnect();

})().then(() => {
    console.log("DONE");
}).catch(error => {
    console.log(error);
});

