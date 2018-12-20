import { Entity } from "../entities";
import { FindOneOptions } from "./find-one-options";
import { Session } from "./session";
import { IncludesOptions } from "./includes-options";
import { Direction } from "../../constants";

export interface FindOptions<T extends Entity, TSession extends Session> extends FindOneOptions<T, TSession>, IncludesOptions {
    skip?: number;
    limit?: number;
    sort?: [keyof T, Direction.ascending | Direction.descending][];
}