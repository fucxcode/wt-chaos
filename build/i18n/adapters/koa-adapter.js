"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n = require("koa-i18n");
const _ = __importStar(require("../../utilities"));
const _getLocaleFromUrl = function (url, locales) {
    const segIndex = 0;
    const parts = url.split("/");
    // Handle paths that start with a slash, i.e., '/foo' -> ['', 'foo']
    if (parts[0] === "") {
        parts.shift();
    }
    const localeInUrl = parts[segIndex];
    return !_.isEmpty(localeInUrl) && locales.includes(localeInUrl)
        ? localeInUrl
        : null;
};
class KoaI18nAdapter {
    constructor(config, app) {
        this.config = config;
        this._config = _.merge({
            extension: ".json",
            queryParameter: "lang"
        }, config);
        this._initializeApp(app);
    }
    _initializeApp(app) {
        const config = this.config;
        i18n(app, {
            directory: this.config.directory,
            defaultLocale: this.config.defaultLocale,
            devMode: false,
            updateFiles: false,
            queryParameter: this.config.queryParameter,
            extension: this.config.extension,
            locales: this.config.supportLocales,
            modes: [
                // "query",                //  optional detect querystring - `/?locale=en-US`
                // "subdomain",            //  optional detect subdomain   - `zh-CN.koajs.com`
                // "cookie",               //  optional detect cookie      - `Cookie: locale=zh-TW`
                // "header",               //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
                // "url",                  //  optional detect url         - `/en`
                // "tld",                  //  optional detect tld(the last domain) - `koajs.cn`
                function (ctx) {
                    //  optional custom function (will be bound to the koa context)
                    // const ctx: ctx = <Context>this;
                    // url locale ("/en-us/price") > cookie locale (lang) and set cookie locale as url local when url local has value
                    const urlLocale = _getLocaleFromUrl(ctx.request.originalUrl, config.supportLocales || []);
                    const cookieLocale = ctx.cookies.get(config.queryParameter || "lang");
                    const locale = urlLocale ? urlLocale : cookieLocale;
                    if (!_.isEmpty(locale) && cookieLocale !== locale) {
                        ctx.cookies.set("lang", locale, {
                            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            httpOnly: false,
                            domain: config.domain,
                            path: "/"
                        });
                    }
                    _.assign(ctx.state, {
                        locale: locale || config.defaultLocale || "zh-cn"
                    });
                    // "/en-us" - > "/" and "/en-us/price" - > "/price"
                    ctx.request.url = ((url, urlLocale) => {
                        if (urlLocale) {
                            let pos = 0;
                            let first = "";
                            if (url[0] === "/") {
                                pos++;
                                first = "/";
                            }
                            // Build new url
                            const parts = url.split("/");
                            parts.splice(pos, 1);
                            url = parts.join("/");
                            if (url[0] !== "/") {
                                url = first + url;
                            }
                        }
                        return url;
                    })(ctx.request.url, urlLocale);
                    return locale || "zh-cn";
                }
            ]
        });
        this._i18n = app.context;
    }
    __(key) {
        return this._i18n.__(key);
    }
    get(key) {
        return this.__(key);
    }
    setLocale(locale) {
        this._i18n.setLocale(locale);
    }
}
exports.KoaI18nAdapter = KoaI18nAdapter;
//# sourceMappingURL=koa-adapter.js.map