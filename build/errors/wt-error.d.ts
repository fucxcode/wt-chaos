import { WTCode } from "./code";
export declare class WTError extends Error {
    private _code;
    readonly code: WTCode | number;
    private _expectValue?;
    readonly expectValue: any;
    private _actualValue?;
    readonly actualValue: any;
    constructor(code: WTCode | number, message: string, expectValue?: any, actualValue?: any);
    toHttpResponseValue(): WTErrorResponse;
    toString(): string;
}
export declare type WTErrorResponse = {
    code: WTCode | number;
    expect_value: any;
    actual_value: any;
    message: string;
};
