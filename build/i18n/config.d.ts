export declare enum I18nAdapterType {
    koa = "koa"
}
export interface I18nLoaderConfig {
    defaultLocale?: string;
    supportLocales?: string[];
    directory: string;
    extension?: string;
    queryParameter?: string;
    domain: string;
}
export interface I18nTemplateLoaderConfig {
    defaultLocale?: string;
    supportLocales?: string[];
    cache?: boolean;
    directory?: string;
    extension?: string;
    templates?: {
        [moduleKey: string]: {
            [locale: string]: any;
        };
    };
}
