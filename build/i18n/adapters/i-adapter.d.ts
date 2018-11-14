export interface II18nAdapter {
    __(key: string, locale?: string): string;
    get(key: string, locale?: string): string;
    setLocale(locale: string): void;
}
