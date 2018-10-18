"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_base_1 = require("./redis-base");
const ioredis_1 = __importDefault(require("ioredis"));
class RedisSentinel extends redis_base_1.RedisBase {
    constructor(options) {
        super(new ioredis_1.default(options));
    }
}
exports.RedisSentinel = RedisSentinel;
//# sourceMappingURL=redis-sentinel.js.map