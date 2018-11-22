"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const mustache = __importStar(require("mustache"));
const errors_1 = require("../../errors");
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
class TPLOptions {
    constructor(subject, to, renderData, templatePath, layoutPath, from) {
        this.subject = subject;
        this.to = to;
        this.renderData = renderData;
        this.templatePath = templatePath;
        this.layoutPath = layoutPath;
        this.from = from;
    }
}
exports.TPLOptions = TPLOptions;
class TPLResolver {
    constructor(config) {
        this.config = config;
    }
    checkRenderData(renderData) {
        for (const data in renderData) {
            if (SPAM_LIST.includes(data)) {
                return false;
            }
        }
        return true;
    }
    async resolveLayout(layout) {
        const content = fs.readFileSync(path.resolve(this.config.layout, layout), "utf-8");
        return content;
    }
    async resolveTemplate(template) {
        let content;
        content = fs.readFileSync(path.resolve(this.config.template, template), "utf-8");
        return content;
    }
    async resolveOptions(options) {
        if (!this.checkRenderData(options.renderData)) {
            throw new errors_1.WTInvalidInputError("spam data");
        }
        const template = await this.resolveTemplate(options.templatePath);
        let html;
        if (this.config.layout && options.layoutPath) {
            const layout = await this.resolveLayout(options.layoutPath);
            html = mustache.render(layout, options.renderData, { body: template });
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
exports.TPLResolver = TPLResolver;
//# sourceMappingURL=tpl-resolver.js.map