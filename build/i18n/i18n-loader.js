"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../utilities"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("./constants");
class I18nLoader {
    constructor(iI18nAdapter, config, templateConfig) {
        this._locale = constants_1.DEFAULT_LOCALE;
        this._templateCache = new Map();
        this._config = _.merge(this._getDefaultI18nLoaderConfig, config);
        this._iI18nAdapter = iI18nAdapter;
        this.setLocale(this._config.defaultLocale || constants_1.DEFAULT_LOCALE);
        this._templateConfig = this._initializeTemplateConfig(templateConfig);
    }
    _getSupportLocales() {
        return ["zh-cn", "en-us", "zh-tw'"];
    }
    _getDefaultI18nLoaderConfig() {
        return {
            directory: "",
            domain: ".worktile",
            supportLocales: this._getSupportLocales(),
            defaultLocale: "zh-cn"
        };
    }
    _getDefaultI18nTemplateLoaderConfig() {
        return {};
    }
    _initializeTemplateConfig(templateConfig) {
        this._templateConfig = _.merge(this._getDefaultI18nTemplateLoaderConfig, templateConfig);
        if (!this._templateConfig.directory &&
            !this._templateConfig.templates) {
            throw new Error(`Neither template config 's directory or templates been null`);
        }
        return this._templateConfig;
    }
    get locale() {
        return this._locale;
    }
    setLocale(locale) {
        this._locale = locale;
        this._iI18nAdapter.setLocale(locale);
    }
    get(key, locale) {
        return this._iI18nAdapter.get(key, locale || constants_1.DEFAULT_LOCALE);
    }
    __(key, locale) {
        return this._iI18nAdapter.get(key, locale || constants_1.DEFAULT_LOCALE);
    }
    loadTemplate(moduleKey, locale = constants_1.DEFAULT_LOCALE) {
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
                }
                else {
                    throw new Error(`can't find ${moduleKey}'s ${locale} config`);
                }
            }
            else {
                throw new Error(`${moduleKey} is not found in templates`);
            }
        }
        else if (this._templateConfig.directory) {
            const extension = this._templateConfig.extension || constants_1.DEFAULT_EXTENSION;
            // moduleKey: "initialization.account" => "{directory}/initialization/account/zh-cn.json"
            // moduleKey: "account" => "{directory}account/zh-cn.json"
            const modulePath = moduleKey.split(".").join("/");
            const filePath = path_1.default.join(this._templateConfig.directory, `${modulePath}/${locale}${extension}`);
            if (!fs_1.default.existsSync(filePath)) {
                throw new Error(`${filePath} file is not found.`);
            }
            if ([".ts", ".js"].includes(extension)) {
                return require(filePath);
            }
            else {
                const contentString = fs_1.default.readFileSync(filePath).toString();
                const content = JSON.parse(contentString);
                if (this._templateConfig.cache) {
                    this._templateCache.set(cacheKey, content);
                }
                return content;
            }
        }
        else {
            throw new Error(`Neither template config 's directory or templates been null`);
        }
    }
}
exports.I18nLoader = I18nLoader;
//# sourceMappingURL=i18n-loader.js.map