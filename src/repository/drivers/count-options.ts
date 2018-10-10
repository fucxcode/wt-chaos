import { ReadPreference } from "./read-preference";
import { ReadPreferenceOptions } from "./read-preference-options";
import { MaxTimeMsOptions } from "./max-time-ms-options";
import { Session } from "./session";
import { SessionOptions } from "./session-option";
import { IncludesOptions } from "./includes-options";

export interface CountOptions<TSession extends Session> extends ReadPreferenceOptions, MaxTimeMsOptions, SessionOptions<TSession>, IncludesOptions {
    // The limit of documents to count.
    limit?: number;
    // The number of documents to skip for the count.
    skip?: boolean;
    // An index name hint for the query.
    hint?: string;
}