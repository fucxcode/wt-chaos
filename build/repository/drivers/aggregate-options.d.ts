import { MaxTimeMsOptions } from "./max-time-ms-options";
import { ReadPreferenceOptions } from "./read-preference-options";
import { SessionOptions } from "./session-option";
import { Session } from "./session";
export interface AggregateOptions<TSession extends Session> extends MaxTimeMsOptions, ReadPreferenceOptions, SessionOptions<TSession> {
    cursor?: {
        batchSize: number;
    };
    explain?: boolean;
    allowDiskUse?: boolean;
    bypassDocumentValidation?: boolean;
}
