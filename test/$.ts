import { assert } from "chai";
import * as randomstring from "randomstring";
import { WTError } from "../src/errors/wt-error";

class $ {

    public static getBodyFromResponse<T>(response: any, resolver: (body: any) => T = x => x.data.value, expectCode: number = 200): T {
        assert.ok(response);
        assert.strictEqual(response.statusCode, 200, `response.statusCode: ${response.statusCode} !== 200`);

        assert.ok(response.body, `no response body`);
        const body = response.body;
        assert.strictEqual(body.code, expectCode, `response.body.code: ${body.code} !== 200 \n${JSON.stringify(body, null, 2)}`);

        return resolver(body);
    }

    public static randomString(length: number = 8, charset: string = "alphabetic"): string {
        return randomstring.generate({
            length: length,
            charset: "alphabetic"
        });
    }

    public static async throwAsync<T>(fn: () => Promise<T>, expectedCode?: number, expectedMessage?: string): Promise<T> {
        try {
            const result = await fn();
            assert.fail(undefined, undefined, "expect an error through but actually not");
            return result;
        }
        catch (ex) {
            assert.ok(ex);
            if (expectedCode || expectedMessage) {
                const error = ex as WTError;
                if (expectedCode) {
                    assert.strictEqual(expectedCode, error.code);
                }
                if (expectedMessage) {
                    assert.strictEqual(expectedMessage, error.message);
                }
            }
        }
    }

    public static async notThrowAsync<T>(fn: () => T, expectedCode?: number, expectedMessage?: string): Promise<T> {
        try {
            return await fn();
        }
        catch (ex) {
            if (expectedCode || expectedMessage) {
                if (ex) {
                    const error = ex as WTError;
                    if (expectedCode) {
                        assert.notStrictEqual(expectedCode, error.code);
                    }
                    if (expectedMessage) {
                        assert.notStrictEqual(expectedMessage, error.message);
                    }
                }
            }
            else {
                assert.fail(undefined, undefined, ex);
            }
        }
    }
    
}

export { $ };