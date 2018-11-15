import { I18nConfig, I18nTemplateLoaderConfig } from "./config";
export declare class I18n {
    private _i18n2;
    protected _templateCache: Map<string, object>;
    protected _config: I18nConfig;
    protected _templateConfig?: I18nTemplateLoaderConfig;
    private _initializeTemplateConfig;
    static instance(config?: I18nConfig, templateConfig?: I18nTemplateLoaderConfig): I18n;
    constructor(config?: I18nConfig, templateConfig?: I18nTemplateLoaderConfig);
    translate(key: string, locale: string, ...args: string[]): any;
    __(key: string, locale: string, ...args: string[]): any;
    loadTemplate(moduleKey: string, locale?: string): any;
}
