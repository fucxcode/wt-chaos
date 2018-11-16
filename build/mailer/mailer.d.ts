import { IMail } from "./adapter";
import { MailConfig } from "./config";
export declare class TemplateSetting {
    subject: string;
    templatePath: string;
    layoutPath?: string | undefined;
    constructor(subject: string, templatePath: string, layoutPath?: string | undefined);
}
export declare class Mailer {
    private instance;
    private config;
    constructor(instance: IMail, config: MailConfig);
    private checkRenderData;
    private sendInternal;
    send(templateSetting: TemplateSetting, renderData: Object, to: string): Promise<any>;
    serviceSend(templateSetting: TemplateSetting, renderData: Object, to: string): Promise<any>;
}
