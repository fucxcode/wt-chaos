import { Omit } from "lodash";
import { RedisBase } from "./redis-base";
import IORedis from "ioredis";

class RedisSentinel extends RedisBase {

    constructor(options: Pick<IORedis.RedisOptions, "sentinels" | "name" | "password">) {
        super(new IORedis(options));
    }

}

export { RedisSentinel };