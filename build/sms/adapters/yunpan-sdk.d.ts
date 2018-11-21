export declare class YunPianSdk {
    private appKey;
    private BASE_URL;
    constructor(appKey: string);
    static getInstance(appKey: string): YunPianSdk;
    private _post;
    private getSMSTemplateValue;
    sendTemplateSMS(templateId: string, mobile: string, params?: object): Promise<any>;
    sendVoiceCode(mobile: string, code: string): Promise<any>;
}
