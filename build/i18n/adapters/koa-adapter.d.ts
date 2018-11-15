import { I18nLoaderConfig } from "../config";
import { II18nAdapter } from "./i-adapter";
export declare class KoaI18nAdapter implements II18nAdapter {
    protected config: I18nLoaderConfig;
    _i18n: any;
    protected _config: I18nLoaderConfig;
    private _initializeApp;
    constructor(config: I18nLoaderConfig, app: any);
    __(key: string): string;
    get(key: string): string;
    setLocale(locale: string): void;
}
