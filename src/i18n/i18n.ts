import { I18nConfig, I18nTemplateLoaderConfig } from "./config";
import * as _ from "../utilities";
import path from "path";
import fs from "fs";
import {
    DEFAULT_LOCALE,
    DEFAULT_EXTENSION,
    DEFAULT_I18N_CONFIG
} from "./constants";
const vsprintf = require("sprintf-js").vsprintf;
const I18n2 = require("i18n-2");

export class I18n {
    private _i18n2: any;

    protected _templateCache = new Map<string, object>();

    protected _config: I18nConfig;

    protected _templateConfig: I18nTemplateLoaderConfig;

    private _initializeTemplateConfig(
        templateConfig?: I18nTemplateLoaderConfig
    ) {
        this._templateConfig = _.merge({}, templateConfig);
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

    static instance(
        config?: I18nConfig,
        templateConfig?: I18nTemplateLoaderConfig
    ) {
        return new I18n(config, templateConfig);
    }

    constructor(
        config?: I18nConfig,
        templateConfig?: I18nTemplateLoaderConfig
    ) {
        this._config = _.merge({}, DEFAULT_I18N_CONFIG, config);
        if (templateConfig) {
            this._templateConfig = this._initializeTemplateConfig(
                templateConfig
            );
        }
        this._i18n2 = new I18n2(this._config);
    }

    translate(key: string, locale: string, ...args: string[]) {
        let message = this._i18n2.translate(locale, key);
        if (args && args.length > 0) {
            message = vsprintf(message, args);
        }
        return message;
    }

    __(key: string, locale: string, ...args: string[]) {
        return this.translate(key, locale, ...args);
    }

    loadTemplate(moduleKey: string, locale: string = DEFAULT_LOCALE) {
        const cacheKey = `${moduleKey}-${locale}`;

        if (this._templateCache.has(cacheKey)) {
            return this._templateCache.get(cacheKey);
        }
        if (!this._templateConfig) {
            throw new Error(`template config is null.`);
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
