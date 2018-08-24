import { assert } from "chai";
import * as _ from "../src/utilities";
import { is } from "../src/constants";
import { $ } from "./$";
import * as TypeMoq from "typemoq";
import { Redis } from "../src/redis/index";
import * as mongodb from "mongodb";
import { CacheKey, RedisCache, Randomizer } from "../src/cache";
import { BSONSerializer } from "../src/serializer";

class Entity {
    constructor(
        public _id: mongodb.ObjectId = new mongodb.ObjectId(),
        public team: mongodb.ObjectId = new mongodb.ObjectId(),
        public title: string = $.randomString()
    ) {
    }
}

const keyResolver = (entity: Entity, collectionName: string) => new CacheKey(entity.team.toString(), collectionName, entity._id.toString());

describe("redis-cache", () => {

    it(`getByKey: key = exists, expireInMilliseconds = undefined -> return value`, async () => {
        const serializer = new BSONSerializer();
        const prefix = $.randomString();
        const collectionName = $.randomString();
        const entity = new Entity();
        const expectKey = keyResolver(entity, collectionName);
        const expectValue = serializer.serialize(entity);

        const redis = TypeMoq.Mock.ofType<Redis>(undefined, TypeMoq.MockBehavior.Strict);
        redis.setup(x => x.getBuffer(expectKey.toString(prefix))).returns(async () => expectValue).verifiable();

        const cache = new RedisCache(redis.object, prefix, serializer);
        const actualValue = await cache.getByKey<Entity>(expectKey);
        redis.verifyAll();
        assert.strictEqual(JSON.stringify(actualValue), JSON.stringify(entity));
    });

    it(`getByKey: key = not exists (redis return undefined), expireInMilliseconds = undefined -> return undefined`, async () => {
        const serializer = new BSONSerializer();
        const prefix = $.randomString();
        const collectionName = $.randomString();
        const entity = new Entity();
        const expectKey = keyResolver(entity, collectionName);

        const redis = TypeMoq.Mock.ofType<Redis>(undefined, TypeMoq.MockBehavior.Strict);
        redis.setup(x => x.getBuffer(expectKey.toString(prefix))).returns(async () => undefined).verifiable();

        const cache = new RedisCache(redis.object, prefix, serializer);
        const actualValue = await cache.getByKey<Entity>(expectKey);
        redis.verifyAll();
        assert.strictEqual(actualValue, undefined);
    });

    it(`getByKey: key = not exists (redis return empty buffer), expireInMilliseconds = undefined -> return undefined`, async () => {
        const serializer = new BSONSerializer();
        const prefix = $.randomString();
        const collectionName = $.randomString();
        const entity = new Entity();
        const expectKey = keyResolver(entity, collectionName);

        const redis = TypeMoq.Mock.ofType<Redis>(undefined, TypeMoq.MockBehavior.Strict);
        redis.setup(x => x.getBuffer(expectKey.toString(prefix))).returns(async () => Buffer.from([])).verifiable();

        const cache = new RedisCache(redis.object, prefix, serializer);
        const actualValue = await cache.getByKey<Entity>(expectKey);
        redis.verifyAll();
        assert.strictEqual(actualValue, undefined);
    });

    it(`getByKey: key = exists, expireInMilliseconds = specified -> update ttl, return value`, async () => {
        const serializer = new BSONSerializer();
        const prefix = $.randomString();
        const jitter = _.random(1, 50);
        const collectionName = $.randomString();
        const entity = new Entity();
        const expectKey = keyResolver(entity, collectionName);
        const expectValue = serializer.serialize(entity);
        const expire = _.random(100, 200);
        const expectExpire = _.random(0, jitter, false);

        const randomizer = TypeMoq.Mock.ofType<Randomizer>(undefined, TypeMoq.MockBehavior.Strict);
        randomizer.setup(x => x.random(0, jitter, false)).returns(() => expectExpire).verifiable();
        const redis = TypeMoq.Mock.ofType<Redis>(undefined, TypeMoq.MockBehavior.Strict);
        redis.setup(x => x.getBuffer(expectKey.toString(prefix))).returns(async () => expectValue).verifiable();
        redis.setup(x => x.pexpire(expectKey.toString(prefix), expire + expectExpire)).verifiable();

        const cache = new RedisCache(redis.object, prefix, serializer, randomizer.object, jitter);
        const actualValue = await cache.getByKey<Entity>(expectKey, expire);
        redis.verifyAll();
        assert.strictEqual(JSON.stringify(actualValue), JSON.stringify(entity));
    });

    it(`getByKey: key = not exists, expireInMilliseconds = specified -> not update ttl, return undefined`, async () => {
        const serializer = new BSONSerializer();
        const prefix = $.randomString();
        const collectionName = $.randomString();
        const entity = new Entity();
        const expectKey = keyResolver(entity, collectionName);

        const redis = TypeMoq.Mock.ofType<Redis>(undefined, TypeMoq.MockBehavior.Strict);
        redis.setup(x => x.getBuffer(expectKey.toString(prefix))).returns(async () => undefined).verifiable();

        const cache = new RedisCache(redis.object, prefix, serializer);
        const actualValue = await cache.getByKey<Entity>(expectKey, _.random(100, 200));
        redis.verifyAll();
        assert.strictEqual(actualValue, undefined);
    });

    it(`setByEntity: expireInMilliseconds = undefined -> set without expire`, async () => {
        const serializer = new BSONSerializer();
        const prefix = $.randomString();
        const collectionName = $.randomString();
        const entity = new Entity();
        const expectKey = keyResolver(entity, collectionName);
        const expectValue = serializer.serialize(entity);

        const redis = TypeMoq.Mock.ofType<Redis>(undefined, TypeMoq.MockBehavior.Strict);
        redis.setup(x => x.set(expectKey.toString(prefix), expectValue)).verifiable();
        
        const cache = new RedisCache(redis.object, prefix, serializer);
        const result = await cache.setByEntity(entity, v => keyResolver(v, collectionName));

        redis.verifyAll();
        assert.deepStrictEqual(result, expectKey);
    });

});