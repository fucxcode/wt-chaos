import { WTError } from "./wt-error";
export declare class WTForbiddenError extends WTError {
    constructor(message: string, expectValue?: any, actualValue?: any);
}
