"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const spam_1 = require("./spam");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const mustache = __importStar(require("mustache"));
const __1 = require("../");
class TemplateSetting {
    constructor(subject, templatePath, layoutPath) {
        this.subject = subject;
        this.templatePath = templatePath;
        this.layoutPath = layoutPath;
    }
}
exports.TemplateSetting = TemplateSetting;
class Mailer {
    constructor(instance, config) {
        this.instance = instance;
        this.config = config;
    }
    checkRenderData(renderData) {
        for (const data in renderData) {
            if (spam_1.spamList.includes(data)) {
                return false;
            }
        }
        return true;
    }
    async sendInternal(templateSetting, renderData, from, to) {
        const templatePath = path.resolve(this.config.template, templateSetting.templatePath);
        if (!this.checkRenderData(renderData)) {
            throw new __1.WTError(__1.code.invalidInput, "spam data");
        }
        const template = fs.readFileSync(templatePath, "utf-8");
        let html;
        if (!__1._.isEmpty(templateSetting.layoutPath) && !__1._.isNil(this.config.layout)) {
            const layoutPath = path.resolve(this.config.layout, templateSetting.layoutPath);
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
    async send(templateSetting, renderData, to) {
        return await this.sendInternal(templateSetting, renderData, this.config.sender.noreply, to);
    }
    async serviceSend(templateSetting, renderData, to) {
        return await this.sendInternal(templateSetting, renderData, this.config.sender.service, to);
    }
}
exports.Mailer = Mailer;
//# sourceMappingURL=mailer.js.map