import { YunPianSdk } from "./yunpian-sdk";
import { SmsInterface } from "../base";

const defaultMinutes = 3;

export class YunPian implements SmsInterface {

    private appKey: string;

    private yunPianSdk: YunPianSdk;

    constructor(appKey: string) {

        this.appKey = appKey;
        this.yunPianSdk = YunPianSdk.getInstance(this.appKey);
    }

    public async sendVerificationCode(templateId: string, mobile: string, code: string, minutes?: number) {
        return await this.yunPianSdk.sendTemplateSMS(templateId, mobile, {
            code: code,
            minute: minutes || defaultMinutes
        });
    }

    public async sendVoiceCode(mobile: string, code: string) {
        return await this.yunPianSdk.sendVoiceCode(mobile, code);
    }

    public async sendMessage(templateId: string, mobile: string, params?: object) {
        return await this.yunPianSdk.sendTemplateSMS(templateId, mobile, params);
    }

}