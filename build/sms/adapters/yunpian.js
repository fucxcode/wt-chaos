"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yunpian_sdk_1 = require("./yunpian-sdk");
const defaultMinutes = 3;
class YunPian {
    constructor(appKey) {
        this.appKey = appKey;
        this.yunPianSdk = yunpian_sdk_1.YunPianSdk.getInstance(this.appKey);
    }
    async sendVerificationCode(templateId, mobile, code, minutes) {
        return await this.yunPianSdk.sendTemplateSMS(templateId, mobile, {
            code: code,
            minute: minutes || defaultMinutes
        });
    }
    async sendVoiceCode(mobile, code) {
        return await this.yunPianSdk.sendVoiceCode(mobile, code);
    }
    async sendMessage(templateId, mobile, params) {
        return await this.yunPianSdk.sendTemplateSMS(templateId, mobile, params);
    }
}
exports.YunPian = YunPian;
//# sourceMappingURL=yunpian.js.map