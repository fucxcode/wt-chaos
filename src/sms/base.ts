export interface SmsInterface {

    sendVerificationCode(templateId: string, mobile: string, code: string, minutes?: number): Promise<any>;

    sendVoiceCode(mobile: string, code: string): Promise<any>;

    sendMessage(templateId: string, mobile: string, params: object): Promise<any>;

}