import { I18nConfig } from "./config";

export const DEFAULT_LOCALE = "zh-cn";
export const DEFAULT_EXTENSION = ".json";
export const DEFAULT_SUPPORT_LOCALES = ["zh-cn", "en-us", "zh-tw"];
export const DEFAULT_QUERY_PARAMETER = "lang";

export const DEFAULT_I18N_CONFIG: I18nConfig = {
    directory: "",
    domain: ".worktile.com",
    locales: DEFAULT_SUPPORT_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    extension: ".json",
    devMode: process.env.NODE_ENV !== "production"
};
