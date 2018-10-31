import { Omit } from "lodash";
import { RedisBase } from "./redis-base";
import IORedis from "ioredis";

class RedisStandalone extends RedisBase {

    constructor(options: Omit<IORedis.RedisOptions, "sentinels">) {
        super(new IORedis(options));
    }

}

export { RedisStandalone };