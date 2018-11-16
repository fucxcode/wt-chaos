import { spamList } from "./spam";
import * as path from "path";
import * as fs from "fs";
import * as mustache from "mustache";
import { _, WTError, WTCode } from "../";
import { IMail } from "./adapter";
import { MailConfig } from "./config";
import { ITemplateResolver } from "./i-template-resolver";
import { createTransport, } from "nodemailer";

export class TemplateSetting {
    constructor(
        public subject: string,
        public templatePath: string,
        public layoutPath?: string
    ) { }
}

export class Mailer {
    private instance: IMail;

    private config: MailConfig;

    private templateResolver?: ITemplateResolver;
    constructor(instance: IMail, config: MailConfig, resolver?: ITemplateResolver) {
        this.instance = instance;
        this.config = config;
        this.templateResolver = resolver;
    }

    private checkRenderData(renderData: Object): boolean {
        for (const data in renderData) {
            if (spamList.includes(data)) {
                return false;
            }
        }
        return true;
    }

    private async resolveLayout(layout?: string): Promise<string | undefined> {
        let content: string | undefined;
        if (this.templateResolver && this.templateResolver.resolveLayout) {
           content = await this.templateResolver.resolveLayout(layout);
        }
        else if (layout) {
            content = fs.readFileSync(path.resolve(<string>this.config.layout, layout), "utf-8");
        }
        return content;
    }

    private async resolveTemplate(template: string) {
        let content: string;
        if (this.templateResolver) {
           content = await this.templateResolver.resolveTemplate(template);
        }
        else {
            content = fs.readFileSync(path.resolve(<string>this.config.template, template), "utf-8");
        }
        return content;
    }

    private async sendInternal(templateSetting: TemplateSetting, renderData: Object, from: string, to: string) {
        if (!this.checkRenderData(renderData)) {
            throw new WTError(WTCode.invalidInput, "spam data");
        }
        const template = await this.resolveTemplate(templateSetting.templatePath);
        const layout = await this.resolveLayout(templateSetting.layoutPath);

        let html;
        if (layout) {
            const layoutPath = path.resolve(<string>this.config.layout, <string>templateSetting.layoutPath);
            const layout = fs.readFileSync(layoutPath, "utf-8");
            html = mustache.render(layout, renderData, { body: template });
        } 
        else {
            html = mustache.render(template, renderData);
        }
        const email = {
            from: from,
            to: to,
            subject: templateSetting.subject,
            html: html
        };

        return await this.instance.sendMail(email);
    }

    public async send(templateSetting: TemplateSetting, renderData: Object, to: string) {
        return await this.sendInternal(templateSetting, renderData, this.config.sender.noreply, to);
    }

    public async serviceSend(templateSetting: TemplateSetting, renderData: Object, to: string) {
        return await this.sendInternal(templateSetting, renderData, this.config.sender.service, to);
    }
}