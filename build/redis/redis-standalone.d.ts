import { Omit } from "lodash";
import { RedisBase } from "./redis-base";
import IORedis from "ioredis";
declare class RedisStandalone extends RedisBase {
    constructor(options: Omit<IORedis.RedisOptions, "sentinels">);
}
export { RedisStandalone };
