"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scTransport = require("nodemailer-sendcloud-transport");
class SendCloud {
    get name() {
        return this._name;
    }
    get version() {
        return this._version;
    }
    constructor(options) {
        this._name = "sendCloud";
        this.instance = scTransport(options);
        this._version = this.instance.version;
    }
    send(mail, callback) {
        return this.instance.send(mail, callback);
    }
}
exports.SendCloud = SendCloud;
//# sourceMappingURL=send-cloud.js.map