import { RedisBase } from "./redis-base";
import IORedis from "ioredis";
declare class RedisSentinel extends RedisBase {
    constructor(options: Pick<IORedis.RedisOptions, "sentinels" | "name" | "password">);
}
export { RedisSentinel };
