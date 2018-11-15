"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const errors_1 = require("../errors");
const yunpan_sdk_1 = require("./lib/yunpan-sdk");
class YunPianService extends base_1.SmsBaseService {
    constructor(appKey) {
        super();
        if (!appKey) {
            throw new errors_1.WTError(errors_1.code.invalidInput, `app key is null`);
        }
        this.appKey = appKey;
        this.yunPianSdk = yunpan_sdk_1.YunPianSdk.getInstance(this.appKey);
    }
    async sendVerificationCode(templateId, mobile, code) {
    }
    async sendVoiceCode(mobile, code) {
    }
    async sendMessage(templateId, mobile, params) {
    }
}
exports.YunPianService = YunPianService;
//# sourceMappingURL=yunpian.js.map