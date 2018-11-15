import { SmsBaseService } from "./base";
export declare class YunPianService extends SmsBaseService {
    private appKey;
    private yunPianSdk;
    constructor(appKey: string);
    sendVerificationCode(templateId: string, mobile: string, code: string): Promise<void>;
    sendVoiceCode(mobile: string, code: string): Promise<void>;
    sendMessage(templateId: string, mobile: string, params: object): Promise<void>;
}
