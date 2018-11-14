import { I18nLoaderConfig, I18nTemplateLoaderConfig } from "./config";
import { II18nAdapter } from "./adapters";
export declare class I18nLoader {
    protected _locale: string;
    protected _templateCache: Map<string, object>;
    protected _config: I18nLoaderConfig;
    protected _templateConfig: I18nTemplateLoaderConfig;
    protected _iI18nAdapter: II18nAdapter;
    protected _getSupportLocales(): string[];
    protected _getDefaultI18nLoaderConfig(): I18nLoaderConfig;
    protected _getDefaultI18nTemplateLoaderConfig(): I18nTemplateLoaderConfig;
    private _initializeTemplateConfig;
    readonly locale: string;
    constructor(iI18nAdapter: II18nAdapter, config?: I18nLoaderConfig, templateConfig?: I18nTemplateLoaderConfig);
    setLocale(locale: string): void;
    get(key: string, locale?: string): string;
    __(key: string, locale?: string): string;
    loadTemplate(moduleKey: string, locale?: string): any;
}
