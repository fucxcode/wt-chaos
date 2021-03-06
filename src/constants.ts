import * as mongodb from "mongodb";

export interface ISomeObject<T> {
    [key: string]: T;
}

export enum Is {
    yes = 1,
    no = 0
}

export enum Direction {
    ascending = 1,
    descending = -1
}

export type ObjectID = Composite<mongodb.ObjectId, string>;

export type UID = string;

export type Timestamp = number;

export const EMPTY_OBJECT_ID_STR = `000000000000000000000000`;
export const EMPTY_OBJECT_ID = new mongodb.ObjectId(EMPTY_OBJECT_ID_STR);

export const ME_UID = "00000000000000000000000000000000";
export const ME = {
    uid: ME_UID,
    display_name: "我",
    name: "",
    avatar: ""
};

export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_PAGE_SIZE_LIMIT = 500;

export const POSITION_STEP = 65536;

export type Composite<T, S> = T | S;

export type ObjectOrId<T> = Composite<mongodb.ObjectId, T>;

export type Projection<T> = (keyof T)[] | { [key in keyof T]?: Is; };

export type Constructor<T> = new (...args: any[]) => T;

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}