"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
class TemplateSetting {
    constructor(subject, templatePath, layoutPath) {
        this.subject = subject;
        this.templatePath = templatePath;
        this.layoutPath = layoutPath;
    }
}
exports.TemplateSetting = TemplateSetting;
class Mailer {
    constructor(transport, resolver) {
        this.instance = nodemailer_1.createTransport(transport);
        this.optionsResolver = resolver;
    }
    async send(options) {
        const eMailOptions = await this.optionsResolver.resolveOptions(options);
        return await this.instance.sendMail(eMailOptions);
    }
}
exports.Mailer = Mailer;
//# sourceMappingURL=mailer.js.map