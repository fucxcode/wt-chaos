"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wt_error_1 = require("./wt-error");
const code_1 = require("./code");
class WTInvalidInputError extends wt_error_1.WTError {
    constructor(message, expectValue, actualValue) {
        super(code_1.WTCode.invalidInput, message, expectValue, actualValue);
    }
}
exports.WTInvalidInputError = WTInvalidInputError;
//# sourceMappingURL=wt-invalid-input-error.js.map