import { SmsInterface } from "./base";
export interface SmsOptions {
    appKey: string;
    platform: string;
    appSecret?: string;
    option?: any;
}
export declare enum Platform {
    yunPian = "yunpian"
}
export declare class SmsSender {
    private service;
    constructor(service: SmsInterface);
    static getInstance(options: SmsOptions, service?: SmsInterface): SmsSender;
    private static getService;
    sendVerificationCode(templateId: string, mobile: string, code: string, minutes?: number): Promise<any>;
    sendVoiceCode(mobile: string, code: string): Promise<any>;
    sendMessage(templateId: string, mobile: string, params?: object): Promise<any>;
}
