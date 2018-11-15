"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LOCALE = "zh-cn";
exports.DEFAULT_EXTENSION = ".json";
exports.DEFAULT_SUPPORT_LOCALES = ["zh-cn", "en-us", "zh-tw"];
exports.DEFAULT_QUERY_PARAMETER = "lang";
exports.DEFAULT_I18N_CONFIG = {
    directory: "",
    domain: ".worktile.com",
    locales: exports.DEFAULT_SUPPORT_LOCALES,
    defaultLocale: exports.DEFAULT_LOCALE,
    extension: ".json",
    devMode: process.env.NODE_ENV !== "production"
};
//# sourceMappingURL=constants.js.map