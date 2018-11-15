export enum I18nAdapterType {
  koa = "koa"
}

export interface I18nConfig {
  defaultLocale?: string;
  locales?: string[]; // support locales
  directory: string;
  extension?: string;
  queryParameter?: string;
  domain: string;
  devMode?: boolean;
}

export interface I18nTemplateLoaderConfig {
  cache?: boolean; // 是否缓存，默认 false
  directory?: string; // 指定整个目录
  extension?: string; // 配置文件后缀，默认是 json, 可以是 ts，js
  // 自定义模版配置，当 templates 被指定， directory 和 extension 无效
  templates?: {
    [moduleKey: string]: {
      [locale: string]: any;
    };
  };
}
