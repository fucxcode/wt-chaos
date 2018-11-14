import { I18nLoaderConfig, I18nTemplateLoaderConfig } from "./config";
import { II18nAdapter, KoaI18nAdapter } from "./adapters";
import * as _ from "../utilities";
import path from "path";
import fs from "fs";
import { DEFAULT_LOCALE, DEFAULT_EXTENSION } from "./constants";

export class I18nLoader {
    protected _locale: string = DEFAULT_LOCALE;

    protected _templateCache = new Map<string, object>();

    protected _config: I18nLoaderConfig;

    protected _templateConfig: I18nTemplateLoaderConfig;

    protected _iI18nAdapter: II18nAdapter;

    protected _getSupportLocales() {
        return ["zh-cn", "en-us", "zh-tw'"];
    }

    protected _getDefaultI18nLoaderConfig(): I18nLoaderConfig {
        return {
            directory: "",
            domain: ".worktile",
            supportLocales: this._getSupportLocales(),
            defaultLocale: "zh-cn"
        };
    }

    protected _getDefaultI18nTemplateLoaderConfig(): I18nTemplateLoaderConfig {
        return {};
    }

    private _initializeTemplateConfig(
        templateConfig?: I18nTemplateLoaderConfig
    ) {
        this._templateConfig = _.merge(
            this._getDefaultI18nTemplateLoaderConfig,
            templateConfig
        );
        if (
            !this._templateConfig.directory &&
            !this._templateConfig.templates
        ) {
            throw new Error(
                `Neither template config 's directory or templates been null`
            );
        }
        return this._templateConfig;
    }

    get locale() {
        return this._locale;
    }

    constructor(
        iI18nAdapter: II18nAdapter,
        config?: I18nLoaderConfig,
        templateConfig?: I18nTemplateLoaderConfig
    ) {
        this._config = _.merge(this._getDefaultI18nLoaderConfig, config);
        this._iI18nAdapter = iI18nAdapter;
        this.setLocale(this._config.defaultLocale || DEFAULT_LOCALE);
        this._templateConfig = this._initializeTemplateConfig(templateConfig);
    }

    setLocale(locale: string) {
        this._locale = locale;
        this._iI18nAdapter.setLocale(locale);
    }

    get(key: string, locale?: string) {
        return this._iI18nAdapter.get(key, locale || DEFAULT_LOCALE);
    }

    __(key: string, locale?: string) {
        return this._iI18nAdapter.get(key, locale || DEFAULT_LOCALE);
    }

    loadTemplate(moduleKey: string, locale: string = DEFAULT_LOCALE) {
        const cacheKey = `${moduleKey}-${this.locale}`;

        if (this._templateCache.has(cacheKey)) {
            return this._templateCache.get(cacheKey);
        }
        if (this._templateConfig.templates) {
            const moduleTemplates = this._templateConfig.templates[moduleKey];
            if (moduleTemplates) {
                const moduleTemplate = moduleTemplates[locale];
                if (moduleTemplate) {
                    if (this._templateConfig.cache) {
                        this._templateCache.set(cacheKey, moduleTemplate);
                    }
                    return moduleTemplate;
                } else {
                    throw new Error(
                        `can't find ${moduleKey}'s ${locale} config`
                    );
                }
            } else {
                throw new Error(`${moduleKey} is not found in templates`);
            }
        } else if (this._templateConfig.directory) {
            const extension =
                this._templateConfig.extension || DEFAULT_EXTENSION;
            // moduleKey: "initialization.account" => "{directory}/initialization/account/zh-cn.json"
            // moduleKey: "account" => "{directory}account/zh-cn.json"
            const modulePath = moduleKey.split(".").join("/");
            const filePath = path.join(
                this._templateConfig.directory,
                `${modulePath}/${locale}${extension}`
            );

            if (!fs.existsSync(filePath)) {
                throw new Error(`${filePath} file is not found.`);
            }
            if ([".ts", ".js"].includes(extension)) {
                return require(filePath);
            } else {
                const contentString = fs.readFileSync(filePath).toString();
                const content = JSON.parse(contentString);
                if (this._templateConfig.cache) {
                    this._templateCache.set(cacheKey, content);
                }
                return content;
            }
        } else {
            throw new Error(
                `Neither template config 's directory or templates been null`
            );
        }
    }
}
