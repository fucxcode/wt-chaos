"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yunpian_1 = require("./yunpian");
const common_1 = require("./common");
const errors_1 = require("../errors");
class SmsSender {
    constructor(options) {
        if (options.platform === common_1.smsPlatform.yunPian) {
            this.platformService = new yunpian_1.YunPianService(options.appKey);
        }
        else {
            throw new errors_1.WTError(errors_1.code.invalidInput, `options platform is null`);
        }
    }
}
exports.SmsSender = SmsSender;
//# sourceMappingURL=index.js.map