import { IOptionsResolver } from "./i-resolver";
import * as path from "path";
import * as fs from "fs";
import * as mustache from "mustache";
import { WTInvalidInputError } from "../../errors";
import Mail = require("nodemailer/lib/mailer");
import * as util from "util";

const SPAM_LIST = [
    "奔跑吧",
    "粉丝回馈活动",
    "84978888",
    "真人秀",
    "奔跑吧兄弟",
    "浙江电视台",
    "浙江卫视",
    "浙 江 卫 视",
    "澳门金沙",
    "连环夺宝",
    "www.789471.com",
    "940656987",
    "大奖无限",
    "同步开奖",
    "澳门威尼斯人",
    "031160.com",
    "876023.com",
    "威尼斯人",
    "特邀您来",
    "876071",
    "取款",
    "516583876",
    "威尼斯人",
    "首存特惠",
    "更多优惠",
    "登陆98",
    "注册就送",
    "點com",
    "彩票",
    "j0067"
];

export class TPLOptions {
    constructor(
        public subject: string,
        public to: string | string[],
        public renderData: Object,
        public templatePath: string,
        public layoutPath?: string,
        public from?: string
    ) { }
}

export interface TPLConfig {
    template?: string; // 模板根路径
    layout?: string; // 布局根路径
    sender: {
        noreply: string,
        service: string
    };
}

export class TPLResolver implements IOptionsResolver {

    private config: TPLConfig;

    constructor(config: TPLConfig) {
        this.config = config;
    }

    private checkRenderData(renderData: Object): boolean {
        for (const data in renderData) {
            if (SPAM_LIST.includes(data)) {
                return false;
            }
        }
        return true;
    }

    private async resolveLayout(layout: string): Promise<string | undefined> {
        const readFileAsync = util.promisify(fs.readFile).bind(fs);
        const content = (await readFileAsync(path.resolve(<string>this.config.layout, layout), "utf-8")).toString();
        return content;
    }

    private async resolveTemplate(template: string): Promise<string> {
        let content: string;
        const readFileAsync = util.promisify(fs.readFile).bind(fs);
        content = (await readFileAsync(path.resolve(<string>this.config.template, template), "utf-8")).toString();
        return content;
    }

    public async resolveOptions(options: TPLOptions): Promise<Mail.Options> {
        if (!this.checkRenderData(options.renderData)) {
            throw new WTInvalidInputError("spam data");
        }
        const  template = await this.resolveTemplate(options.templatePath);
        let html: string;
        if (this.config.layout && options.layoutPath) {
            const layout = await this.resolveLayout(options.layoutPath);
            html = mustache.render(layout!, options.renderData, { body: template });
        }
        else {
            html = mustache.render(template, options.renderData);
        }

        const emailOptions = {
            from: options.from || this.config.sender.noreply,
            to: options.to,
            subject: options.subject,
            html: html
        };
        return emailOptions;
    }
}