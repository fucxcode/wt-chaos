import { WTError } from "./wt-error";
export declare class WTNotFoundError extends WTError {
    constructor(message: string, expectValue?: any, actualValue?: any);
}
