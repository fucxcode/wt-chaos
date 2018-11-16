import { assert } from "chai";
import {
    WTError,
    WTInvalidInputError,
    WTForbiddenError,
    WTInternalError,
    WTNotFoundError,
    WTCode
} from "../src/errors";
import { $ } from "./$";

function assertWTError(
    error: WTError,
    expectCode: number,
    expectValue: any,
    actualValue: string,
    message: string
) {
    const response = error.toHttpResponseValue();
    assert.equal(expectCode, response.code);
    assert.equal(expectValue, response.expect_value);
    assert.equal(actualValue, response.actual_value);
    assert.equal(message, response.message);
}

describe("errors", () => {
    it("error code [401]", () => {
        const expectValue = $.randomString();
        const actualValue = $.randomString();
        const resCode = WTCode.invalidInput;
        const message = $.randomString();
        const error = new WTError(resCode, message, expectValue, actualValue);
        const response = error.toHttpResponseValue();
        assert.equal(resCode, response.code);
        assert.equal(expectValue, response.expect_value);
        assert.equal(actualValue, response.actual_value);
        assert.equal(message, response.message);
    });

    it("WTInvalidInputError code [401]", () => {
        const expectValue = $.randomString();
        const actualValue = $.randomString();
        const message = $.randomString();
        const error = new WTInvalidInputError(
            message,
            expectValue,
            actualValue
        );
        assertWTError(
            error,
            WTCode.invalidInput,
            expectValue,
            actualValue,
            message
        );
    });

    it("WTForbiddenError code [403] forbidden", () => {
        const expectValue = $.randomString();
        const actualValue = $.randomString();
        const message = $.randomString();
        const error = new WTForbiddenError(
            message,
            expectValue,
            actualValue
        );
        assertWTError(
            error,
            WTCode.forbidden,
            expectValue,
            actualValue,
            message
        );
    });

    it("WTInternalError code [500] internal", () => {
        const expectValue = $.randomString();
        const actualValue = $.randomString();
        const message = $.randomString();
        const error = new WTInternalError(
            message,
            expectValue,
            actualValue
        );
        assertWTError(
            error,
            WTCode.internalError,
            expectValue,
            actualValue,
            message
        );
    });

    it("WTNotFoundError code [404] not-found", () => {
        const expectValue = $.randomString();
        const actualValue = $.randomString();
        const message = $.randomString();
        const error = new WTNotFoundError(
            message,
            expectValue,
            actualValue
        );
        assertWTError(
            error,
            WTCode.notFound,
            expectValue,
            actualValue,
            message
        );
    });
});
