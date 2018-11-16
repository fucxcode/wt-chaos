import { WTError } from "./wt-error";
export declare class WTInternalError extends WTError {
    constructor(message: string, expectValue?: any, actualValue?: any);
}
