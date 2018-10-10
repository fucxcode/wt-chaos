import { Session } from "./session";
import { SessionOptions } from "./session-option";

export interface UpdateOptions<TSession extends Session> extends SessionOptions<TSession> {
    upsert?: boolean;
    w?: number | string;
    wtimeout?: number;
    j?: boolean;
    bypassDocumentValidation?: boolean;
}