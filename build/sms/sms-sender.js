"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yunpian_1 = require("./adapters/yunpian");
var platform;
(function (platform) {
    platform["yunPian"] = "yunpian";
})(platform = exports.platform || (exports.platform = {}));
class SmsSender {
    constructor(service) {
        this.service = service;
    }
    static getInstance(options) {
        const service = SmsSender.getService(options);
        return new SmsSender(service);
    }
    static getService(options) {
        switch (options.appKey) {
            case platform.yunPian:
                return new yunpian_1.YunPian(options.appKey);
                break;
            default:
                return new yunpian_1.YunPian(options.appKey);
                break;
        }
    }
    async sendVerificationCode(templateId, mobile, code, minutes) {
        return await this.service.sendVerificationCode(templateId, mobile, code, minutes);
    }
    async sendVoiceCode(mobile, code) {
        return await this.service.sendVoiceCode(mobile, code);
    }
    async sendMessage(templateId, mobile, params) {
        return await this.service.sendMessage(templateId, mobile, params);
    }
}
exports.SmsSender = SmsSender;
//# sourceMappingURL=sms-sender.js.map