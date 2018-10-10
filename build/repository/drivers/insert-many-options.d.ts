import { InsertOneOptions } from "./insert-one-options";
import { Session } from "./session";
export interface InsertManyOptions<TSession extends Session> extends InsertOneOptions<TSession> {
    ordered?: boolean;
}
