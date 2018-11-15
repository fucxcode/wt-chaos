import { SmsInterface } from "./base";
import { YunPian } from "./adapters/yunpian";

export interface SmsOptions {
    appKey: string;
    platform: string;
    appSecret?: string;
    option?: any;
}

export enum platform {

    yunPian = "yunpian"

}

export class SmsSender {

    private service: SmsInterface;

    constructor(service: SmsInterface) {
        this.service = service;
    }

    public static getInstance(options: SmsOptions, service?: SmsInterface) {
        if (!service) {
            service = SmsSender.getService(options);
        }
        return new SmsSender(service);
    }

    private static getService(options: SmsOptions): SmsInterface {
        switch (options.appKey) {
            case platform.yunPian:
                return new YunPian(options.appKey);
                break;
            default:
                return new YunPian(options.appKey);
                break;
        }

    }

    public async sendVerificationCode(templateId: string, mobile: string, code: string, minutes?: number) {
        return await this.service.sendVerificationCode(templateId, mobile, code, minutes);
    }

    public async sendVoiceCode(mobile: string, code: string) {
        return await this.service.sendVoiceCode(mobile, code);
    }

    public async sendMessage(templateId: string, mobile: string, params: object) {
        return await this.service.sendMessage(templateId, mobile, params);
    }
}