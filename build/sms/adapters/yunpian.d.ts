import { SmsInterface } from "../base";
export declare class YunPian implements SmsInterface {
    private appKey;
    private yunPianSdk;
    constructor(appKey: string);
    sendVerificationCode(templateId: string, mobile: string, code: string, minutes?: number): Promise<any>;
    sendVoiceCode(mobile: string, code: string): Promise<any>;
    sendMessage(templateId: string, mobile: string, params?: object): Promise<any>;
}
