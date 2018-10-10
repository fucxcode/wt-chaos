import { InsertOneOptions } from "./insert-one-options";
import { Session } from "./session";

export interface InsertManyOptions<TSession extends Session> extends InsertOneOptions<TSession> {
    // If true, when an insert fails, don't execute the remaining writes. If false, continue with remaining inserts when one fails.
    ordered?: boolean;
}