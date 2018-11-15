export declare enum I18nAdapterType {
    koa = "koa"
}
export interface I18nConfig {
    defaultLocale?: string;
    locales?: string[];
    directory: string;
    extension?: string;
    queryParameter?: string;
    domain: string;
    devMode?: boolean;
}
export interface I18nTemplateLoaderConfig {
    cache?: boolean;
    directory?: string;
    extension?: string;
    templates?: {
        [moduleKey: string]: {
            [locale: string]: any;
        };
    };
}
