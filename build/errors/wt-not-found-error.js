"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wt_error_1 = require("./wt-error");
const code_1 = require("./code");
class WTNotFoundError extends wt_error_1.WTError {
    constructor(message, expectValue, actualValue) {
        super(code_1.WTCode.notFound, message, expectValue, actualValue);
    }
}
exports.WTNotFoundError = WTNotFoundError;
//# sourceMappingURL=wt-not-found-error.js.map