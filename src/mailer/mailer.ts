import { _, WTError, WTCode } from "../";
import { createTransport, TransportOptions, Transport } from "nodemailer";
import Mail = require("nodemailer/lib/mailer");
import { IOptionsResolver } from "./resolvers";

export class Mailer {

    private instance: Mail;

    private optionsResolver: IOptionsResolver;

    constructor(transport: Transport | TransportOptions, resolver: IOptionsResolver) {
        this.instance = createTransport(transport);
        this.optionsResolver = resolver;
    }

    public async send(options: any): Promise<any> {
        const eMailOptions = await this.optionsResolver.resolveOptions(options);
        return await this.instance.sendMail(eMailOptions);
    }
}