import { WTError } from "./wt-error";
import { WTCode } from "./code";

export class WTInvalidInputError extends WTError {
    constructor(message: string, expectValue?: any, actualValue?: any) {
        super(WTCode.invalidInput, message, expectValue, actualValue);
    }
}
