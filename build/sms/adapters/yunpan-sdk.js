"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../../utilities"));
const qs = require("querystring");
const request = __importStar(require("request-promise"));
class YunPianSdk {
    constructor(appKey) {
        this.appKey = appKey;
        this.BASE_URL = `https://sms.yunpian.com/v2`;
    }
    static getInstance(appKey) {
        return new YunPianSdk(appKey);
    }
    async _post(path, data) {
        return await request.post({
            url: `${this.BASE_URL}${path}`,
            headers: {
                "Accept": "application/json;charset=utf-8",
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            form: _.assign(data, {
                apikey: this.appKey
            })
        });
    }
    getSMSTemplateValue(values) {
        return _.reduce(values, (result, value, key) => {
            result[`#${key}#`] = value;
            return result;
        }, {});
    }
    async sendTemplateSMS(templateId, mobile, params) {
        const values = this.getSMSTemplateValue(params || {});
        const textResponse = await this._post(`/tpl/get.json`, { tpl_id: templateId });
        const body = JSON.parse(textResponse);
        let text = body.tpl_content;
        _.forEach(_.keys(values), item => {
            text = (text || "").replace(item, values[item]);
        });
        return await this._post(`/sms/single_send.json`, {
            mobile: mobile,
            text: text
        });
    }
    async sendVoiceCode(mobile, code) {
        const data = {
            mobile: mobile,
            code: code
        };
        const options = {
            url: "https://voice.yunpian.com/v2/voice/send.json",
            headers: {
                "Accept": "application/json;charset=utf-8",
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            form: _.assign(data, {
                apikey: this.appKey
            })
        };
        return await request.post(options);
    }
}
exports.YunPianSdk = YunPianSdk;
//# sourceMappingURL=yunpan-sdk.js.map