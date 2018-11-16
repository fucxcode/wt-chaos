
export interface IMail {
    sendMail(mailOptions: any): Promise<any>;
}