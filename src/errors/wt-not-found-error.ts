import { WTError } from "./wt-error";
import { WTCode } from "./code";

export class WTNotFoundError extends WTError {
    constructor(message: string, expectValue?: any, actualValue?: any) {
        super(WTCode.notFound, message, expectValue, actualValue);
    }
}
