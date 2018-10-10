import { Session } from "./session";

export interface InsertOneOptions<TSession extends Session> {
    // The write concern.
    w?: number | string;
    // The write concern timeout.
    wtimeout?: number;
    // Specify a journal write concern.
    j?: boolean;
    // Serialize functions on any object.
    serializeFunctions?: boolean;
    // Force server to assign _id values instead of driver.
    forceServerObjectId?: boolean;
    // Allow driver to bypass schema validation in MongoDB 3.2 or higher.
    bypassDocumentValidation?: boolean;

    session?: TSession;
}