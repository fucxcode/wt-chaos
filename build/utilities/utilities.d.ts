import "reflect-metadata";
import { ObjectID, Projection, ObjectOrId } from "../constants";
import * as mongodb from "mongodb";
import { Id } from "../repository";
export declare function wait(milliseconds: number): Promise<void>;
export declare function isNil(value: any): boolean;
export declare function isNilOrWriteSpaces(value: any): boolean;
export declare function findEnumByValue(enums: any, value: any): {
    key: string;
    value: any;
} | undefined;
export declare function isObjectId(id: any): id is mongodb.ObjectId;
export declare function mapKeys(object: any, iteratee: (sourceValue: any, sourceKey: string) => string, thisArg?: any): any;
export declare function updateMetadata<TValue, TUpdate>(metadataKey: string, metadataUpdateValue: TUpdate, target: Object, initializer: () => TValue, updater: (value: TValue, update: TUpdate) => TValue, thisArg?: any): TValue;
export declare function convertToRegExp(keyword: any): RegExp;
export declare function objectIdEquals<TID extends Id>(x: TID, y: TID): boolean;
/**
 *  return unique Id in nested array, mostly used for get ids for db query
 */
export declare function flattenId(array: Array<any>, path: string, prev?: ObjectID[]): Array<ObjectID>;
export declare function toMap<T, TKey, TValue>(arr: T[], keyResolver: (elem: T) => TKey, valueResolver: (elem: T) => TValue): Map<TKey, TValue>;
export declare function censor(censor: any): any;
export declare function nextTick(): Promise<void>;
export declare function project<T extends object>(object: T, projection?: Projection<T>, defaultPicks?: string[]): T;
export declare function toSafeDateTimeNumber(date: number): number;
export declare function formatFromAndToTimeToTimestampSeconds(from?: string | number, to?: string | number, timezone?: string, unitOfTime?: any): Array<number>;
export declare function getIdFromObjectOrId<T>(objectOrId: ObjectOrId<T>, idResolver: (obj: T) => mongodb.ObjectId): mongodb.ObjectId;
export declare function tryParseObjectId(id?: ObjectID | null | undefined, createIfNil?: boolean, objectIdCreator?: (id?: string | number | mongodb.ObjectId) => mongodb.ObjectId): [boolean, mongodb.ObjectId | null | undefined];
/**
 * parse ObjectId from null, undefined, string or an existing ObjectId
 * it will throw exception when input `id` cannot be parsed
 * if `createIfNil = true` it will create a new ObjectId if `id` is falsy
 * otherwise it will return null or undefined based on input parameter `id`
 * especially, when input `id = ''` and `createIfNil = false` it will return null
 * the 3rd argument `objectIdCreator` should NOT be specified unless in unit test
 */
export declare function parseObjectId(id?: ObjectID | null | undefined, createIfNil?: boolean, objectIdCreator?: (id?: string | number | mongodb.ObjectId) => mongodb.ObjectId): mongodb.ObjectId | null | undefined;
export declare function asyncify(fn: (...args: any[]) => any): (...args: any[]) => Promise<any>;
export * from "./lodash-wrapper";
