"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WTError extends Error {
    get code() {
        return this._code;
    }
    get expectValue() {
        return this._expectValue;
    }
    get actualValue() {
        return this._actualValue;
    }
    constructor(code, message, expectValue, actualValue) {
        super(message);
        this._code = code;
        this._expectValue = expectValue;
        this._actualValue = actualValue;
    }
    toHttpResponseValue() {
        return {
            code: this._code,
            expect_value: this._expectValue,
            actual_value: this._actualValue,
            message: this.message
        };
    }
    toString() {
        return JSON.stringify(this.toHttpResponseValue(), null, 2);
    }
}
exports.WTError = WTError;
//# sourceMappingURL=wt-error.js.map