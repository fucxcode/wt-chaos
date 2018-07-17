import * as assert from "assert";
import * as randomstring from "randomstring";

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

}

export { $ };