export interface MailConfig {
    template: string;
    layout?: string;
    sender: {
        noreply: string;
        service: string;
    };
}
