import { Session } from "./session";
export interface InsertOneOptions<TSession extends Session> {
    w?: number | string;
    wtimeout?: number;
    j?: boolean;
    serializeFunctions?: boolean;
    forceServerObjectId?: boolean;
    bypassDocumentValidation?: boolean;
    session?: TSession;
}
