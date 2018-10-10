import { ReadPreferenceOptions } from "./read-preference-options";
import { MaxTimeMsOptions } from "./max-time-ms-options";
import { Session } from "./session";
import { SessionOptions } from "./session-option";
import { IncludesOptions } from "./includes-options";
export interface CountOptions<TSession extends Session> extends ReadPreferenceOptions, MaxTimeMsOptions, SessionOptions<TSession>, IncludesOptions {
    limit?: number;
    skip?: boolean;
    hint?: string;
}
