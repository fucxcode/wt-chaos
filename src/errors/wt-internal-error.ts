import { WTError } from "./wt-error";
import { WTCode } from "./code";

export class WTInternalError extends WTError {
    constructor(message: string, expectValue?: any, actualValue?: any) {
        super(WTCode.internalError, message, expectValue, actualValue);
    }
}
