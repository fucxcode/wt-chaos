import { TransportOptions, Transport } from "nodemailer";
import { IOptionsResolver } from "./resolvers";
export declare class Mailer<TOptions> {
    private instance;
    private optionsResolver;
    constructor(transport: Transport | TransportOptions, resolver: IOptionsResolver);
    send(options: TOptions): Promise<any>;
}
