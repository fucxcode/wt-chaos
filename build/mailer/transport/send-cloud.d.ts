import { ITransport } from "./i-transport";
export declare class SendCloud implements ITransport {
    private _name;
    readonly name: string;
    private _version;
    readonly version: string;
    private instance;
    constructor(options: any);
    send(mail: any, callback: (err: Error | null, info: any) => void): void;
}
