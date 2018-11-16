"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wt_error_1 = require("./wt-error");
const code_1 = require("./code");
class WTForbiddenError extends wt_error_1.WTError {
    constructor(message, expectValue, actualValue) {
        super(code_1.WTCode.forbidden, message, expectValue, actualValue);
    }
}
exports.WTForbiddenError = WTForbiddenError;
//# sourceMappingURL=wt-forbidden-error.js.map