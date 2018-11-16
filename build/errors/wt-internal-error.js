"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wt_error_1 = require("./wt-error");
const code_1 = require("./code");
class WTInternalError extends wt_error_1.WTError {
    constructor(message, expectValue, actualValue) {
        super(code_1.WTCode.internalError, message, expectValue, actualValue);
    }
}
exports.WTInternalError = WTInternalError;
//# sourceMappingURL=wt-internal-error.js.map