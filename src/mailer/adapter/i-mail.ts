import { IMailOptions } from "./i-mail-options";
export interface IMail {
    sendMail(mailOptions: IMailOptions): Promise<any>;
}