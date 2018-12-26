import { Cache, RedisBase } from "../../src/cache";

const Redis = require("ioredis-mock");

class RedisMock extends RedisBase {

    constructor() {
        super(new Redis());
    }

}

export const cache = new RedisMock();