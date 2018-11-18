import {Mailer, ITransport, IOptionsResolver } from "../../src/mailer";
import Mail = require("nodemailer/lib/mailer");
import * as TypeMoq from "typemoq";
import { $ } from "../$";
import * as assert from "assert";
const EventEmitter = require('events');

class TestTransport extends EventEmitter implements ITransport {
    private _name: string;
    public get name(): string {
        return this._name;
    }

    private _version: string;
    public get version(): string {
        return this._version;
    }

    private _invoked: boolean;
    public get invoked(): boolean {
        return this._invoked;
    }

    private _mailOptions: any;
    public get mailOptions() {
        return this._mailOptions;
    }

    constructor(){
        super();
        this._name = "test mailer";
        this._version = "0.1";        
    }

    public send(options: any, callback: Function) {
        this._invoked = true;
        this._mailOptions = options.data;
        callback(null, options);
    }
}

class TestOptionsResolver implements IOptionsResolver {

    private _invoked: boolean;
    public get invoked(): boolean {
        return this._invoked;
    }

    private _receivedOptions: any;
    public get receivedOptions() {
        return this._receivedOptions;
    }

    private _donateOptions: any;
    public get donateOptions() {
        return this._donateOptions;
    }

    constructor(donateOptions: any){
        this._donateOptions = donateOptions;
        this._invoked = false;
    }

    public async resolveOptions(options: any) {
        this._invoked = true;
        this._receivedOptions = options;
        return this._donateOptions as Mail.Options;
    }
}

describe("#mailer", function () {
    it("#send => optionsResolver invoked. transport invoked", async () => {
        const transport = new TestTransport();
        const transitionOptions = {token: $.randomString()};
        const resolver = new TestOptionsResolver(transitionOptions);
        const mailer = new Mailer(transport, resolver);
        const inputOptions = $.randomString();
        await mailer.send(inputOptions);

        assert.equal(resolver.invoked, true);
        assert.equal(resolver.receivedOptions, inputOptions);
        assert.equal(transport.invoked, true);
        assert.equal(transport.mailOptions.token, transitionOptions.token);

    });
})