import * as _ from "../../utilities";
const qs = require("querystring");
import * as request from "request-promise";


export class YunPianSdk {

    private appKey: string;

    private BASE_URL: string;

    constructor(appKey: string) {
        this.appKey = appKey;
        this.BASE_URL = `https://sms.yunpian.com/v2`;
    }

    static getInstance(appKey: string) {
        return new YunPianSdk(appKey);
    }

    private async _post(path: string, data: object) {
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

    private _getSMSTemplateValue(values: any): any {
        return _.reduce(values, (result: any, value, key) => {
            result[`#${key}#`] = value;
            return result;
        }, {});
    }

    public async sendTemplateSMS(templateId: string, mobile: string, params: object) {
        const values = this._getSMSTemplateValue(params);
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

    public async sendVoiceCode(mobile: string, code: string) {
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