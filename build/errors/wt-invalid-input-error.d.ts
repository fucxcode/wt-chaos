import { WTError } from "./wt-error";
export declare class WTInvalidInputError extends WTError {
    constructor(message: string, expectValue?: any, actualValue?: any);
}
