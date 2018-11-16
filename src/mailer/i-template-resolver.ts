export interface ITemplateResolver {
    resolveLayout?(layout?: string): string;

    resolveTemplate(template: string): string;
}
