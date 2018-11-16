import { assert } from "chai";
import * as _ from "../src/utilities";
import * as mongodb from "mongodb";
import { is } from "../src/constants";
import { $ } from "./$";

describe("utilities", () => {

    describe("basic", () => {

        it("null isNil return true", () => {
            const result = _.isNil(null);
            assert.equal(result, true);
        });

        it("undefined isNil return true", () => {
            const result = _.isNil(undefined);
            assert.equal(result, true);
        });

        it("'' isNil return false", () => {
            const result = _.isNil("");
            assert.equal(result, false);
        });

        it("false isNil return false", () => {
            const result = _.isNil(false);
            assert.equal(result, false);
        });

        it("filter [1, 2, 3] return [2]", () => {
            const result = _.filter([1, 2, 3], x => x === 2);
            assert.equal(result.length, 1);
            assert.equal(result[0], 2);
        });

        it("_.some support arraylike", () => {
            const collection = [1, 2, 3, 4, 5];
            assert.isTrue(_.some(collection, x => x > 3));
        });

        it("_.some support object", () => {
            const collection = {
                one: 1,
                two: 2,
                three: 3
            };
            assert.isTrue(_.some(collection, x => x === 3));
        });

        it("_.some support mongodb.ObjectId[]", () => {
            const id = new mongodb.ObjectId();
            const collection = [
                new mongodb.ObjectId(),
                new mongodb.ObjectId(),
                id,
                new mongodb.ObjectId()
            ];
            assert.isTrue(_.some(collection, x => _.objectIdEquals(x, id)));
        });

        it("_.md5 111111", () => {
            const md51 = _.md5("111111");
            const md52 = _.md5("111111");
            assert.equal(md51, md52);
            assert.equal(md51, "96e79218965eb72c92a549dd5a330112")
        });

    });

    describe("object projection", () => {

        it(`input: undefined. output: undefined`, () => {
            const output = _.project(undefined);
            assert.strictEqual(output, undefined);
        });

        it(`input: null. output: null`, () => {
            const output = _.project(null);
            assert.strictEqual(output, null);
        });

        it(`input: {}. output: {}`, () => {
            const input = {};
            const output = _.project(input);
            assert.deepStrictEqual(output, input);
        });

        it(`projection: undefined. output: all properties`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object);

            assert.deepEqual(output, object);
        });

        it(`projection: null. output: all properties`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, null);

            assert.deepEqual(output, object);
        });

        it(`projection: []. output: all properties`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, []);

            assert.deepEqual(output, object);
        });

        it(`projection: {}. output: all properties`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, {});

            assert.deepEqual(output, object);
        });

        it(`projection: [_id, string_prop, object_prop]. output: [_id, string_prop, object_prop]`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, ["_id", "string_prop", "object_prop"]);

            assert.deepEqual(output, _.pick(object, ["_id", "string_prop", "object_prop"]));
        });

        it(`projection: {_id: 1, number_prop: 1, object_prop: 1}. output: [_id, number_prop, object_prop]`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, {
                _id: is.yes,
                number_prop: is.yes,
                object_prop: is.yes
            });

            assert.deepEqual(output, _.pick(object, ["_id", "number_prop", "object_prop"]));
        });

        it(`projection: {_id: 1, number_prop: 0, object_prop: 1}. output: [_id, object_prop]`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, {
                _id: is.yes,
                number_prop: is.no,
                object_prop: is.yes
            });

            assert.deepEqual(output, _.pick(object, ["_id", "object_prop"]));
        });

        it(`projection: {number_prop: 0}. output: [_id, string_prop, object_prop, array_prop]`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, {
                number_prop: is.no
            });

            assert.deepEqual(output, _.pick(object, ["_id", "string_prop", "object_prop", "array_prop"]));
        });

        it(`projection: {_id: 0, string_prop: 0, number_prop: 0, object_prop: 0, array_prop: 0}. output: []`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, {
                _id: is.no,
                string_prop: is.no,
                number_prop: is.no,
                object_prop: is.no,
                array_prop: is.no
            });

            assert.deepEqual(output, {});
        });

        it(`projection: {string_prop: 1}. default: [] output: [_id, string_prop]`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, {
                string_prop: is.yes
            });

            assert.deepEqual(output, _.pick(object, ["_id", "string_prop"]));
        });

        it(`projection: {string_prop: 1}. default: [_id, number_prop] output: [_id, string_prop, number_prop]`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, {
                string_prop: is.yes
            }, ["_id", "number_prop"]);

            assert.deepEqual(output, _.pick(object, ["_id", "string_prop", "number_prop"]));
        });

        it(`projection: {string_prop: 1}. default: [number_prop] output: [string_prop, number_prop]`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, {
                string_prop: is.yes
            }, ["number_prop"]);

            assert.deepEqual(output, _.pick(object, ["string_prop", "number_prop"]));
        });

        it(`projection: {string_prop: 1, _id: 0}. default: [_id] output: [string_prop]`, () => {
            const object = {
                _id: new mongodb.ObjectId(),
                string_prop: $.randomString(),
                number_prop: _.random(0, 100),
                object_prop: {
                    string_prop: $.randomString(),
                    number_prop: _.random(0, 100),
                },
                array_prop: [
                    $.randomString(),
                    $.randomString(),
                    $.randomString()
                ]
            };

            const output = _.project(object, {
                string_prop: is.yes,
                _id: is.no
            }, ["_id"]);

            assert.deepEqual(output, _.pick(object, ["string_prop"]));
        });

        it(`object: { "prop.has.dot", "shaun.1.xu" }, projection: ["prop.has.dot"], output: ["prop.has.dot"]`, () => {
            const object = {
                "prop.has.dot": $.randomString(),
                "shaun.1.xu": $.randomString()
            };

            const output = _.project(object, ["prop.has.dot"]);

            assert.deepEqual(output, _.pick(object, ["prop.has.dot"]));
        });

        it(`object: { "prop.has.dot", "shaun.1.xu" }, projection: { "shaun.1.xu": 1 }, output: ["shaun.1.xu"]`, () => {
            const object = {
                "prop.has.dot": $.randomString(),
                "shaun.1.xu": $.randomString()
            };

            const output = _.project(object, {
                "shaun.1.xu": is.yes
            });

            assert.deepEqual(output, _.pick(object, ["shaun.1.xu"]));
        });

        it(`object: { "prop.has.dot", "shaun.1.xu" }, projection: { "shaun.1.xu": 0 }, output: ["prop.has.dot"]`, () => {
            const object = {
                "prop.has.dot": $.randomString(),
                "shaun.1.xu": $.randomString()
            };

            const output = _.project(object, {
                "shaun.1.xu": is.no
            });

            assert.deepEqual(output, _.pick(object, ["prop.has.dot"]));
        });

        it(`object: { "prop.has.dot", "prop.has", "prop" }, projection: { "prop.has.dot": 1 }, output: ["prop.has.dot"]`, () => {
            const object = {
                "prop.has.dot": $.randomString(),
                "prop.has": $.randomString(),
                prop: $.randomString()
            };

            const output = _.project(object, {
                "prop.has.dot": is.yes
            });

            assert.deepEqual(output, _.pick(object, ["prop.has.dot"]));
        });

        it(`object: { "prop.has.dot", "prop.has", "prop" }, projection: { "prop.has": 1 }, output: ["prop.has"]`, () => {
            const object = {
                "prop.has.dot": $.randomString(),
                "prop.has": $.randomString(),
                prop: $.randomString()
            };

            const output = _.project(object, {
                "prop.has": is.yes
            });

            assert.deepEqual(output, _.pick(object, ["prop.has"]));
        });

        it(`object: { "prop.has.dot", "prop.has", "prop" }, projection: { "prop": 1 }, output: ["prop"]`, () => {
            const object = {
                "prop.has.dot": $.randomString(),
                "prop.has": $.randomString(),
                prop: $.randomString()
            };

            const output = _.project(object, {
                "prop": is.yes
            });

            assert.deepEqual(output, _.pick(object, ["prop"]));
        });

    });
});