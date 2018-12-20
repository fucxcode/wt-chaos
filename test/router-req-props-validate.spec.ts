import { OperationContext, RouterRequest, resolve, RouterContext, fulfillRouterRequestProperties, validate, validateRouterRequest, required, length, between, equals } from "../src/router";
import { assert } from "chai";
import * as TypeMoq from "typemoq";
import * as uuid from "node-uuid";
import * as _ from "../src/utilities";
import { Id, MongoDBDriver } from "../src/repository";
import { WTError, WTCode } from "../src";
import { $ } from "./$";
import { MongoClient } from "mongodb";


describe("router request: validate properties", () => {

    class TestOperationContext extends OperationContext {

    }

    it(`validate sync`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {

            @validate(async value => !_.isNilOrWriteSpaces(value))
            // @ts-ignore
            public name!: string;

        }

        {
            const request = new TestRouterRequest();
            request.name = _.randomString();
            await validateRouterRequest(request, undefined);
        }

        {
            const request = new TestRouterRequest();
            try {
                await validateRouterRequest(request, undefined);
                assert.fail();
            }
            catch (error) {
                const wtError = error as WTError;
                assert.strictEqual(wtError.code, WTCode.invalidInput);
                assert.strictEqual(wtError.message, `validation failed on property name`);
                assert.strictEqual(wtError.actualValue, request.name);
                assert.isUndefined(wtError.expectValue);
            }
        }
    });

    it(`validate sync, with message & code`, async () => {

        const expect_code = _.random(400, 500);
        const expect_message = _.randomString();

        class TestRouterRequest extends RouterRequest<TestOperationContext> {

            @validate(async value => !_.isNilOrWriteSpaces(value), expect_message, expect_code)
            // @ts-ignore
            public name!: string;

        }

        {
            const request = new TestRouterRequest();
            try {
                await validateRouterRequest(request, undefined);
                assert.fail();
            }
            catch (error) {
                const wtError = error as WTError;
                assert.strictEqual(wtError.code, expect_code);
                assert.strictEqual(wtError.message, expect_message);
                assert.strictEqual(wtError.actualValue, request.name);
                assert.isUndefined(wtError.expectValue);
            }
        }
    });

    it(`validate sync, throw error`, async () => {

        const expect_name = _.randomString();
        const expect_code = _.random(400, 500);
        const expect_message = _.randomString();

        class TestRouterRequest extends RouterRequest<TestOperationContext> {

            @validate(async value => {
                if (expect_name === value) {
                    return true;
                }
                else {
                    throw new WTError(expect_code, expect_message, expect_name, value);
                }
            })
            // @ts-ignore
            public name!: string;

        }

        {
            const request = new TestRouterRequest();
            request.name = _.randomString();
            try {
                await validateRouterRequest(request, undefined);
                assert.fail();
            }
            catch (error) {
                const wtError = error as WTError;
                assert.strictEqual(wtError.code, expect_code);
                assert.strictEqual(wtError.message, expect_message);
                assert.strictEqual(wtError.actualValue, request.name);
                assert.strictEqual(wtError.expectValue, expect_name);
            }
        }
    });

    it(`validate async, with message & code`, async () => {

        const expect_code = _.random(400, 500);
        const expect_message = _.randomString();

        class TestRouterRequest extends RouterRequest<TestOperationContext> {

            @validate(async value => {
                await _.wait(1);
                return !_.isNilOrWriteSpaces(value);
            }, expect_message, expect_code)
            // @ts-ignore
            public name!: string;

        }

        {
            const request = new TestRouterRequest();
            try {
                await validateRouterRequest(request, undefined);
                assert.fail();
            }
            catch (error) {
                const wtError = error as WTError;
                assert.strictEqual(wtError.code, expect_code);
                assert.strictEqual(wtError.message, expect_message);
                assert.strictEqual(wtError.actualValue, request.name);
                assert.isUndefined(wtError.expectValue);
            }
        }
    });

    it(`validate async, throw error`, async () => {

        const expect_name = _.randomString();
        const expect_code = _.random(400, 500);
        const expect_message = _.randomString();

        class TestRouterRequest extends RouterRequest<TestOperationContext> {

            @validate(async value => {
                await _.wait(1);
                if (expect_name === value) {
                    return true;
                }
                else {
                    throw new WTError(expect_code, expect_message, expect_name, value);
                }
            })
            // @ts-ignore
            public name!: string;

        }

        {
            const request = new TestRouterRequest();
            request.name = _.randomString();
            try {
                await validateRouterRequest(request, undefined);
                assert.fail();
            }
            catch (error) {
                const wtError = error as WTError;
                assert.strictEqual(wtError.code, expect_code);
                assert.strictEqual(wtError.message, expect_message);
                assert.strictEqual(wtError.actualValue, request.name);
                assert.strictEqual(wtError.expectValue, expect_name);
            }
        }
    });

    it(`multiple validates on same property, validate all`, async () => {

        const expect_validates = [
            _.randomString(),
            _.randomString()
        ];
        const actual_validates: string[] = [];

        class TestRouterRequest extends RouterRequest<TestOperationContext> {

            @validate(async value => {
                actual_validates.push(expect_validates[0]);
                return true;
            })
            @validate(async value => {
                actual_validates.push(expect_validates[1]);
                return true;
            })
            // @ts-ignore
            public name!: string;

        }

        {
            const request = new TestRouterRequest();
            await validateRouterRequest(request, undefined);
            assert.deepStrictEqual(actual_validates, expect_validates);
        }
    });

    it(`multiple validates on same property, stop on 1st failure`, async () => {

        const expect_validates = [
            _.randomString(),
            _.randomString(),
            _.randomString()
        ];
        const actual_validates: string[] = [];

        class TestRouterRequest extends RouterRequest<TestOperationContext> {

            @validate(async value => {
                actual_validates.push(expect_validates[0]);
                return true;
            })
            @validate(async value => {
                actual_validates.push(expect_validates[1]);
                return false;
            })
            @validate(async value => {
                actual_validates.push(expect_validates[2]);
                return true;
            })
            // @ts-ignore
            public name!: string;

        }

        {
            const request = new TestRouterRequest();
            try {
                await validateRouterRequest(request, undefined);
                assert.fail();
            }
            catch {
                assert.deepStrictEqual(actual_validates, [
                    expect_validates[0],
                    expect_validates[1]
                ]);
            }
        }
    });

    it(`validate on multiple properties, validate all`, async () => {

        const expect_validates = [
            _.randomString(),
            _.randomString()
        ];
        const actual_validates: string[] = [];

        class TestRouterRequest extends RouterRequest<TestOperationContext> {

            @validate(async value => {
                actual_validates.push(expect_validates[0]);
                return true;
            })
            // @ts-ignore
            public name!: string;

            @validate(async value => {
                actual_validates.push(expect_validates[1]);
                return true;
            })
            // @ts-ignore
            public token!: string;
        }

        {
            const request = new TestRouterRequest();
            await validateRouterRequest(request, undefined);
            assert.deepStrictEqual(actual_validates, expect_validates);
        }
    });

    it(`validate on multiple properties, stop on 1st failour`, async () => {

        const expect_validates = [
            _.randomString(),
            _.randomString(),
            _.randomString()
        ];
        const actual_validates: string[] = [];

        class TestRouterRequest extends RouterRequest<TestOperationContext> {

            @validate(async value => {
                actual_validates.push(expect_validates[0]);
                return true;
            })
            // @ts-ignore
            public name!: string;

            @validate(async value => {
                actual_validates.push(expect_validates[1]);
                return false;
            })
            // @ts-ignore
            public token!: string;

            @validate(async value => {
                actual_validates.push(expect_validates[1]);
                return true;
            })
            // @ts-ignore
            public sign!: string;
        }

        {
            const request = new TestRouterRequest();
            try {
                await validateRouterRequest(request, undefined);
                assert.fail();
            }
            catch {
                assert.deepStrictEqual(actual_validates, [
                    expect_validates[0],
                    expect_validates[1]
                ]);
            }
        }
    });

    it(`validate parameters: request & context`, async () => {
        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {

            @validate<TestOperationContext, TestRouterRequest, string>(async (value, key, request, ctx) => {
                request_param = request;
                context_param = ctx;
                key_param = key;
                return true;
            })
            // @ts-ignore
            public name!: string;

        }

        let request_param: TestRouterRequest;
        let context_param: RouterContext<TestOperationContext>;
        let key_param: string;

        const request = new TestRouterRequest();
        request.name = _.randomString();
        await validateRouterRequest(request, contextMock.object);

        assert.equal(request_param, request);
        assert.equal(context_param, contextMock.object);
        assert.equal(key_param, "name");
    });

    it(`@required: has value. pass`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @required()
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = _.randomString();
        await validateRouterRequest(request, undefined);
    });

    it(`@required: value = null. fail`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @required()
            // @ts-ignore
            public value!: any;
        }

        const request = new TestRouterRequest();
        request.value = null;
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `property value is required`,
            request.value
        );
    });

    it(`@required: value = undefined. fail`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @required()
            // @ts-ignore
            public value!: any;
        }

        const request = new TestRouterRequest();
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `property value is required`,
            request.value
        );
    });

    it(`@required: value = empty string. fail`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @required()
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = "";
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `property value is required`,
            request.value
        );
    });

    it(`@required: value = spaces. pass`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @required()
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = " ";
        await validateRouterRequest(request, undefined);
    });

    it(`@required: value = empty object. fail`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @required()
            // @ts-ignore
            public value!: Object;
        }

        const request = new TestRouterRequest();
        request.value = {};
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `property value is required`,
            request.value
        );
    });

    it(`@required: value = empty array. fail`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @required()
            // @ts-ignore
            public value!: any[];
        }

        const request = new TestRouterRequest();
        request.value = [];
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `property value is required`,
            request.value
        );
    });

    it(`@required: value = entity id. pass`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @required()
            // @ts-ignore
            public value!: Id;
        }

        const clientMock = TypeMoq.Mock.ofType<MongoClient>();
        const driver = new MongoDBDriver(clientMock.object, _.randomString());
        const request = new TestRouterRequest();
        request.value = driver.parseId(undefined, true);
        await validateRouterRequest(request, undefined);
    });

    it(`@required: value = null. fail`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @required()
            // @ts-ignore
            public value!: Id;
        }

        const clientMock = TypeMoq.Mock.ofType<MongoClient>();
        const driver = new MongoDBDriver(clientMock.object, _.randomString());
        const request = new TestRouterRequest();
        request.value = driver.parseId(null, false);
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `property value is required`,
            request.value
        );
    });

    it(`@required: value = undefined. fail`, async () => {

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @required()
            // @ts-ignore
            public value!: Id;
        }

        const clientMock = TypeMoq.Mock.ofType<MongoClient>();
        const driver = new MongoDBDriver(clientMock.object, _.randomString());
        const request = new TestRouterRequest();
        request.value = driver.parseId(undefined, false);
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `property value is required`,
            request.value
        );
    });

    it(`@length: value.length < min. fail`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @length(min, max)
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = _.randomString(min - 1);
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `the length of property value value must between ${min} - ${max}`,
            request.value
        );
    });

    it(`@length: value.length = min. pass`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @length(min, max)
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = _.randomString(min);
        await validateRouterRequest(request, undefined);
    });

    it(`@length: min < value.length < max. pass`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @length(min, max)
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = _.randomString(_.random(min + 1, max - 1));
        await validateRouterRequest(request, undefined);
    });

    it(`@length: value.length < max. pass`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @length(min, max)
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = _.randomString(max - 1);
        await validateRouterRequest(request, undefined);
    });

    it(`@length: value.length = max. pass`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @length(min, max)
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = _.randomString(max);
        await validateRouterRequest(request, undefined);
    });

    it(`@length: value.length > max. fail`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @length(min, max)
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = _.randomString(max + 1);
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `the length of property value value must between ${min} - ${max}`,
            request.value
        );
    });

    it(`@length: value = null. fail`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @length(min, max)
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = null;
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `the length of property value value must between ${min} - ${max}`,
            request.value
        );
    });

    it(`@length: value = undefined. fail`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @length(min, max)
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `the length of property value value must between ${min} - ${max}`,
            request.value
        );
    });

    it(`@length(min = number, max = ignore) value > min. pass`, async () => {

        const min = _.random(5, 10);

        class LengthableObj {
            private _length: number;
            public get length(): number {
                return this._length;
            }
            constructor(length: number) {
                this._length = length;
            }
        }

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @length(min)
            // @ts-ignore
            public value!: LengthableObj;
        }

        const request = new TestRouterRequest();
        request.value = new LengthableObj(Number.MAX_SAFE_INTEGER);
        await validateRouterRequest(request, undefined);
    });

    it(`@length(min = ignore, max = number) value < max. pass`, async () => {

        const max = _.random(5, 10);

        class LengthableObj {
            private _length: number;
            public get length(): number {
                return this._length;
            }
            constructor(length: number) {
                this._length = length;
            }
        }

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @length(undefined, max)
            // @ts-ignore
            public value!: LengthableObj;
        }

        const request = new TestRouterRequest();
        request.value = new LengthableObj(Number.MIN_SAFE_INTEGER);
        await validateRouterRequest(request, undefined);
    });

    





















    it(`@between: value.length < min. fail`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @between(min, max)
            // @ts-ignore
            public value!: number;
        }

        const request = new TestRouterRequest();
        request.value = min - 1;
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `the value of property value must between ${min} - ${max}`,
            request.value
        );
    });

    it(`@between: value.length = min. pass`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @between(min, max)
            // @ts-ignore
            public value!: number;
        }

        const request = new TestRouterRequest();
        request.value = min;
        await validateRouterRequest(request, undefined);
    });

    it(`@between: min < value.length < max. pass`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @between(min, max)
            // @ts-ignore
            public value!: number;
        }

        const request = new TestRouterRequest();
        request.value = _.random(min + 1, max - 1);
        await validateRouterRequest(request, undefined);
    });

    it(`@between: value.length < max. pass`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @between(min, max)
            // @ts-ignore
            public value!: number;
        }

        const request = new TestRouterRequest();
        request.value = max - 1;
        await validateRouterRequest(request, undefined);
    });

    it(`@between: value.length = max. pass`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @between(min, max)
            // @ts-ignore
            public value!: number;
        }

        const request = new TestRouterRequest();
        request.value = max;
        await validateRouterRequest(request, undefined);
    });

    it(`@between: value.length > max. fail`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @between(min, max)
            // @ts-ignore
            public value!: number;
        }

        const request = new TestRouterRequest();
        request.value = max + 1;
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `the value of property value must between ${min} - ${max}`,
            request.value
        );
    });

    it(`@between: value = null. fail`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @between(min, max)
            // @ts-ignore
            public value!: number;
        }

        const request = new TestRouterRequest();
        request.value = null;
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `the value of property value must between ${min} - ${max}`,
            request.value
        );
    });

    it(`@between: value = undefined. fail`, async () => {

        const min = _.random(5, 10);
        const max = _.random(15, 20);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @between(min, max)
            // @ts-ignore
            public value!: number;
        }

        const request = new TestRouterRequest();
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `the value of property value must between ${min} - ${max}`,
            request.value
        );
    });

    it(`@between(min = number, max = ignore) value > min. pass`, async () => {

        const min = _.random(5, 10);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @between(min)
            // @ts-ignore
            public value!: number;
        }

        const request = new TestRouterRequest();
        request.value = Number.MAX_SAFE_INTEGER;
        await validateRouterRequest(request, undefined);
    });

    it(`@between(min = ignore, max = number) value < max. pass`, async () => {

        const max = _.random(5, 10);

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @between(undefined, max)
            // @ts-ignore
            public value!: number;
        }

        const request = new TestRouterRequest();
        request.value = Number.MIN_SAFE_INTEGER;
        await validateRouterRequest(request, undefined);
    });

    it(`@equals. equal value. pass`, async () => {
        const expect_value = _.randomString();

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @equals(() => expect_value)
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = expect_value;
        await validateRouterRequest(request, undefined);
    });

    it(`@equals. not equal value. fail`, async () => {
        const expect_value = _.randomString();

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @equals(() => expect_value)
            // @ts-ignore
            public value!: string;
        }

        const request = new TestRouterRequest();
        request.value = _.randomString();
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `the value of property value must be equals to ${expect_value}`,
            request.value
        );
    });

    it(`@equals. equal complex value. pass`, async () => {
        const expect_object = {
            v1: _.randomString(),
            v2: _.random(),
            v3: [
                _.randomString(),
                _.randomString(),
                _.randomString()
            ]
        };

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @equals(() => expect_object)
            // @ts-ignore
            public value!: any;
        }

        const request = new TestRouterRequest();
        request.value = _.cloneDeep(expect_object);
        await validateRouterRequest(request, undefined);
    });

    it(`@equals. not equal complex value. fail`, async () => {
        const expect_object = {
            v1: _.randomString(),
            v2: _.random(),
            v3: [
                _.randomString(),
                _.randomString(),
                _.randomString()
            ]
        };

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @equals(() => expect_object)
            // @ts-ignore
            public value!: any;
        }

        const request = new TestRouterRequest();
        const actual_value = _.cloneDeep(expect_object);
        actual_value.v3[2] = _.randomString();
        request.value = actual_value;
        await $.throwAsync(
            async () => {
                await validateRouterRequest(request, undefined);
            },
            WTCode.invalidInput,
            `the value of property value must be equals to ${expect_object}`,
            request.value
        );
    });
    
    it(`@equals. not equal complex value. customized equality. pass`, async () => {
        const expect_object = {
            v1: _.randomString(),
            v2: _.random(),
            v3: [
                _.randomString(),
                _.randomString(),
                _.randomString()
            ]
        };

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @equals(() => expect_object, (x, y) => x.v1 === y.v1)
            // @ts-ignore
            public value!: any;
        }

        const request = new TestRouterRequest();
        request.value = {
            v1: expect_object.v1,
            v2: _.random(),
            v3: [
                _.randomString(),
                _.randomString(),
                _.randomString()
            ]
        };
        await validateRouterRequest(request, undefined);
    });

    it(`@equals. use request parameter`, async () => {
        const expect_value = _.randomString();

        class TestRouterRequest extends RouterRequest<TestOperationContext> {
            @equals<TestOperationContext, TestRouterRequest, string>(req => req.value2)
            // @ts-ignore
            public value1!: string;
            public value2!: string;
        }

        const request = new TestRouterRequest();
        request.value1 = expect_value;
        request.value2 = expect_value;
        await validateRouterRequest(request, undefined);
    });
});