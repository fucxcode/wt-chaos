"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SmsBaseService {
    constructor() {
    }
    static async sendVerificationCode(templateId, mobile, code) { }
    static async sendVoiceCode(mobile, code) { }
    static async sendMessage(templateId, mobile, params) { }
}
exports.SmsBaseService = SmsBaseService;
//# sourceMappingURL=base.js.map