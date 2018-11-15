const i18n = require("koa-i18n");
import { Context } from "koa";
import { I18nLoaderConfig } from "../config";
import * as _ from "../../utilities";
import { II18nAdapter } from "./i-adapter";

const _getLocaleFromUrl = function(url: string, locales: string[]) {
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

export class KoaI18nAdapter implements II18nAdapter {
    _i18n: any;

    protected _config: I18nLoaderConfig;

    private _initializeApp(app: any) {
        const config = this.config;
        i18n(app, {
            directory: this.config.directory,
            defaultLocale: this.config.defaultLocale,
            devMode: false,
            updateFiles: false,
            queryParameter: this.config.queryParameter,
            extension: this.config.extension,
            locales: this.config.supportLocales, //  `zh-CN` defualtLocale, must match the locales to the filenames
            modes: [
                // "query",                //  optional detect querystring - `/?locale=en-US`
                // "subdomain",            //  optional detect subdomain   - `zh-CN.koajs.com`
                // "cookie",               //  optional detect cookie      - `Cookie: locale=zh-TW`
                // "header",               //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
                // "url",                  //  optional detect url         - `/en`
                // "tld",                  //  optional detect tld(the last domain) - `koajs.cn`
                function(ctx: Context) {
                    //  optional custom function (will be bound to the koa context)
                    // const ctx: ctx = <Context>this;
                    // url locale ("/en-us/price") > cookie locale (lang) and set cookie locale as url local when url local has value
                    const urlLocale = _getLocaleFromUrl(
                        ctx.request.originalUrl,
                        config.supportLocales || []
                    );
                    const cookieLocale = ctx.cookies.get(
                        config.queryParameter || "lang"
                    );
                    const locale = urlLocale ? urlLocale : cookieLocale;
                    if (!_.isEmpty(locale) && cookieLocale !== locale) {
                        ctx.cookies.set("lang", locale, {
                            expires: new Date(
                                Date.now() + 30 * 24 * 60 * 60 * 1000
                            ),
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

    constructor(protected config: I18nLoaderConfig, app: any) {
        this._config = _.merge(
            {
                extension: ".json",
                queryParameter: "lang"
            },
            config
        );
        this._initializeApp(app);
    }

    __(key: string): string {
        return this._i18n.__(key);
    }

    get(key: string): string {
        return this.__(key);
    }

    setLocale(locale: string) {
        this._i18n.setLocale(locale);
    }
}
