import { assert } from "chai";
import { WTError, code } from "../src/errors";
import { $ } from "./$";

describe("errors", () => {
    
    it("error code [401]", () => {
        const expectValue = $.randomString();
        const actualValue = $.randomString();
        const resCode = code.invalidInput;
        const message = $.randomString();
        const error = new WTError(resCode, message, expectValue, actualValue);
        const response = error.toHttpResponseValue();
        assert.equal(resCode, response.code);
        assert.equal(expectValue, response.expect_value);
        assert.equal(actualValue, response.actual_value);
        assert.equal(message, response.message);
    });
});