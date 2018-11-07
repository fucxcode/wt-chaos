import * as mongodb from "mongodb";
export interface ISomeObject<T> {
    [key: string]: T;
}
export declare enum is {
    yes = 1,
    no = 0
}
export declare type ObjectID = Composite<mongodb.ObjectId, string>;
export declare type UID = string;
export declare type Timestamp = number;
export declare const EMPTY_OBJECT_ID_STR = "000000000000000000000000";
export declare const EMPTY_OBJECT_ID: mongodb.ObjectID;
export declare const ME_UID = "00000000000000000000000000000000";
export declare const ME: {
    uid: string;
    display_name: string;
    name: string;
    avatar: string;
};
export declare const DEFAULT_PAGE_SIZE = 20;
export declare const DEFAULT_PAGE_SIZE_LIMIT = 500;
export declare const POSITION_STEP = 65536;
export declare type Composite<T, S> = T | S;
export declare type ObjectOrId<T> = Composite<mongodb.ObjectId, T>;
export declare type Projection<T> = (keyof T)[] | {
    [key in keyof T]?: is;
};
export declare type Constructor<T> = new (...args: any[]) => T;
export declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
