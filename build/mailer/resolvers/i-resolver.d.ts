import Mail = require("nodemailer/lib/mailer");
export interface IOptionsResolver {
    resolveOptions(options: any): Promise<Mail.Options>;
}
