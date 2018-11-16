import { spamList } from "./spam";
import * as path from "path";
import * as fs from "fs";
import * as mustache from "mustache";
import { _, WTError, code } from "../";
import * as util from "util";
import { IMail } from "./adapter";
import { MailConfig } from "./config";

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

    constructor(instance: IMail, config: MailConfig) {
        this.instance = instance;
        this.config = config;
    }

    private checkRenderData(renderData: Object): boolean {
        for (const data in renderData) {
            if (spamList.includes(data)) {
                return false;
            }
        }
        return true;
    }

    private async sendInternal(templateSetting: TemplateSetting, renderData: Object, from: string, to: string) {
        const templatePath = path.resolve(this.config.template,  templateSetting.templatePath);

        if (!this.checkRenderData(renderData)) {
            throw new WTError(code.invalidInput, "spam data");
        }
        const template = fs.readFileSync(templatePath, "utf-8");

        let html;
        if (!_.isEmpty(templateSetting.layoutPath) && !_.isNil(this.config.layout)) {
            const layoutPath = path.resolve(<string>this.config.layout, <string>templateSetting.layoutPath);
            const layout = fs.readFileSync(layoutPath, "utf-8");
            html = mustache.render(layout, renderData, { body: template });
        } else {
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

    public async send(templateSetting: TemplateSetting, renderData: Object,  to: string) {
        return await this.sendInternal(templateSetting, renderData, this.config.sender.noreply, to);
    }

    public async serviceSend(templateSetting: TemplateSetting, renderData: Object,  to: string) {
        return await this.sendInternal(templateSetting, renderData, this.config.sender.service, to);
    }
}