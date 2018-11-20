import { IOptionsResolver } from "./i-resolver";
import Mail = require("nodemailer/lib/mailer");
export declare class TPLOptions {
    subject: string;
    to: string;
    renderData: Object;
    templatePath: string;
    layoutPath?: string | undefined;
    from?: string | undefined;
    constructor(subject: string, to: string, renderData: Object, templatePath: string, layoutPath?: string | undefined, from?: string | undefined);
}
export interface TPLConfig {
    template?: string;
    layout?: string;
    sender: {
        noreply: string;
        service: string;
    };
}
export declare class TPLResolver implements IOptionsResolver {
    private config;
    constructor(config: TPLConfig);
    private checkRenderData;
    private resolveLayout;
    private resolveTemplate;
    resolveOptions(options: TPLOptions): Promise<Mail.Options>;
}
