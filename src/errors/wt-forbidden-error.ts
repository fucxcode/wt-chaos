import { WTError } from "./wt-error";
import { WTCode } from "./code";

export class WTForbiddenError extends WTError {
    constructor(message: string, expectValue?: any, actualValue?: any) {
        super(WTCode.forbidden, message, expectValue, actualValue);
    }
}
