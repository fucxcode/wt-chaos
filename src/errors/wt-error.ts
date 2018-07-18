import code from "./code";

export default class WTError extends Error {

    private _code: code | number;
    public get code(): code | number {
        return this._code;
    }

    private _expectValue?: any;
    public get expectValue(): any {
        return this._expectValue;
    }

    private _actualValue?: any;
    public get actualValue(): any {
        return this._actualValue;
    }
    
    constructor(code: code | number, message: string, expectValue?: any, actualValue?: any) {
        super(message);

        this._code = code;
        this._expectValue = expectValue;
        this._actualValue = actualValue;
    }

    public toHttpResponseValue(): WTErrorResponse {
        return {
            code: this._code,
            expect_value: this._expectValue,
            actual_value: this._actualValue,
            message: this.message
        };
    }

    public toString(): string {
        return JSON.stringify(this.toHttpResponseValue(), null, 2);
    }
}

export type WTErrorResponse = {
    code: code | number,
    expect_value: any,
    actual_value: any,
    message: string
};