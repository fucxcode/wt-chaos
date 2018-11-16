export interface MailConfig {
    template?: string; // 模板根路径
    layout?: string; // 布局根路径
    sender: {
        noreply: string,
        service: string
    };
  }