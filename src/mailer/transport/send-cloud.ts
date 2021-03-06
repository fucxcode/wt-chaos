const scTransport = require("nodemailer-sendcloud-transport");
import { ITransport } from "./i-transport";

export class SendCloud implements ITransport {

    private _name: string;
    public get name(): string {
        return this._name;
    }

    private _version: string;
    public get version(): string {
        return this._version;
    }

    private instance: any;

    constructor(options: any) {
        this._name = "sendCloud";
        this.instance = scTransport(options);
        this._version = this.instance.version;
    }

   public send(mail: any, callback: (err: Error | null, info: any) => void): void {
        return  this.instance.send(mail, callback);
   }
}