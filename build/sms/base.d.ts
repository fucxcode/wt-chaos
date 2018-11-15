export declare class SmsBaseService {
    constructor();
    static sendVerificationCode(templateId: string, mobile: string, code: string): Promise<void>;
    static sendVoiceCode(mobile: string, code: string): Promise<void>;
    static sendMessage(templateId: string, mobile: string, params: object): Promise<void>;
}
