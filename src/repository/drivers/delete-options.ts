import { Session } from "./session";
import { SessionOptions } from "./session-option";

export interface DeleteOptions<TSession extends Session> extends SessionOptions<TSession> {
    w?: number | string;
    wtimeout?: number;
    j?: boolean;
    bypassDocumentValidation?: boolean;
}