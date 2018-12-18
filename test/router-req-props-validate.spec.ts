import { OperationContext, RouterRequest, resolve, RouterContext, fulfillRouterRequestProperties, validate, validateRouterRequest } from "../src/router";
import { assert } from "chai";
import * as TypeMoq from "typemoq";
import * as uuid from "node-uuid";
import * as _ from "../src/utilities";
import { Id } from "../src/repository";
import { WTError, WTCode } from "../src";


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

            @validate<TestOperationContext, TestRouterRequest, string>(async (value, request, ctx) => {
                request_param = request;
                context_param = ctx;
                return true;
            })
            // @ts-ignore
            public name!: string;

        }

        let request_param: TestRouterRequest;
        let context_param: RouterContext<TestOperationContext>;

        const request = new TestRouterRequest();
        request.name = _.randomString();
        await validateRouterRequest(request, contextMock.object); 

        assert.equal(request_param, request);
        assert.equal(context_param, contextMock.object);
    });

});