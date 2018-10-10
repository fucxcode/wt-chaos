import { ReadPreference } from "./read-preference";
import { MaxTimeMsOptions } from "./max-time-ms-options";
import { ReadPreferenceOptions } from "./read-preference-options";
import { SessionOptions } from "./session-option";
import { Session } from "./session";

export interface AggregateOptions<TSession extends Session> extends MaxTimeMsOptions, ReadPreferenceOptions, SessionOptions<TSession> {

    // Return the query as cursor, on 2.6 > it returns as a real cursor
    // on pre 2.6 it returns as an emulated cursor.
    cursor?: {
        batchSize: number;
    };

    // Explain returns the aggregation execution plan (requires mongodb 2.6 >).
    explain?: boolean;

    // lets the server know if it can use disk to store
    // temporary results for the aggregation (requires mongodb 2.6 >).
    allowDiskUse?: boolean;

    // Allow driver to bypass schema validation in MongoDB 3.2 or higher.
    bypassDocumentValidation?: boolean;

}