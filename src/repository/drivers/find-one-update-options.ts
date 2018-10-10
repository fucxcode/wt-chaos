import { Entity } from "../entities";
import { Projection } from "../../constants";
import { Session } from "./session";
import { MaxTimeMsOptions } from "./max-time-ms-options";
import { SessionOptions } from "./session-option";
import { IncludesOptions } from "./includes-options";
export interface FindOneAndUpdateOptions<T extends Entity, TSession extends Session> extends MaxTimeMsOptions, SessionOptions<TSession>, IncludesOptions {
    projection?: Projection<T>;
    sort?: Object;
    upsert?: boolean;
    returnOriginal?: boolean;
}