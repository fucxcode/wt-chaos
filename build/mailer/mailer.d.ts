import { TransportOptions, Transport } from "nodemailer";
import { IOptionsResolver } from "./resolvers";
export declare class TemplateSetting {
    subject: string;
    templatePath: string;
    layoutPath?: string | undefined;
    constructor(subject: string, templatePath: string, layoutPath?: string | undefined);
}
export declare class Mailer {
    private instance;
    private optionsResolver;
    constructor(transport: Transport | TransportOptions, resolver: IOptionsResolver);
    send(options: any): Promise<any>;
}
