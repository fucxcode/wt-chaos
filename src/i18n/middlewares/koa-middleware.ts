const i18n = require("koa-i18n");
import { I18nConfig } from "../config";
import * as _ from "../../utilities";
import { DEFAULT_I18N_CONFIG, DEFAULT_QUERY_PARAMETER } from "../constants";
import { Context } from "koa";

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

const _customMode = function(config: I18nConfig) {
    return function() {
        const ctx = <any>this;
        //  optional custom function (will be bound to the koa context)
        // const ctx: ctx = <Context>this;
        // url locale ("/en-us/price") > cookie locale (lang) and set cookie locale as url local when url local has value
        const urlLocale = _getLocaleFromUrl(
            ctx.request.originalUrl,
            config.locales || []
        );
        const cookieLocale = ctx.cookies.get(
            config.queryParameter || DEFAULT_QUERY_PARAMETER
        );
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
            locale: locale || config.defaultLocale
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
        return locale || config.defaultLocale;
    };
};
export function koaI18nMiddleware(app: any, config: I18nConfig) {
    const _config = _.merge({}, DEFAULT_I18N_CONFIG, config);
    return i18n(app, {
        directory: _config.directory,
        defaultLocale: _config.defaultLocale,
        devMode: false,
        updateFiles: false,
        queryParameter: _config.queryParameter,
        extension: _config.extension,
        locales: _config.locales, //  `zh-CN` defualtLocale, must match the locales to the filenames
        modes: [
            // "query",                //  optional detect querystring - `/?locale=en-US`
            // "subdomain",            //  optional detect subdomain   - `zh-CN.koajs.com`
            // "cookie",               //  optional detect cookie      - `Cookie: locale=zh-TW`
            // "header",               //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
            // "url",                  //  optional detect url         - `/en`
            // "tld",                  //  optional detect tld(the last domain) - `koajs.cn`
            _customMode(_config)
        ]
    });
}
