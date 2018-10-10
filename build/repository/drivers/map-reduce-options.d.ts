import { Session } from "./session";
import { ReadPreferenceOptions } from "./read-preference-options";
import { SessionOptions } from "./session-option";
export interface MapReduceOptions<TSession extends Session> extends ReadPreferenceOptions, SessionOptions<TSession> {
    out?: Object;
    query?: Object;
    sort?: Object;
    limit?: number;
    keeptemp?: boolean;
    finalize?: Function | string;
    scope?: Object;
    jsMode?: boolean;
    verbose?: boolean;
    bypassDocumentValidation?: boolean;
}
