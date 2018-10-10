import { Entity } from "../entities";
import { Projection } from "../../constants";
import { MaxTimeMsOptions } from "./max-time-ms-options";
import { ReadPreferenceOptions } from "./read-preference-options";
import { Session } from "./session";
import { SessionOptions } from "./session-option";
import { IncludesOptions } from "./includes-options";
export interface FindOneOptions<T extends Entity, TSession extends Session> extends MaxTimeMsOptions, ReadPreferenceOptions, SessionOptions<TSession>, IncludesOptions {
    projection?: Projection<T>;
    hint?: any;
}
