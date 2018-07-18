import "reflect-metadata";
import { ObjectID, Projection } from "../constants";
import * as mongodb from "mongodb";
export declare function wait(milliseconds: number): Promise<void>;
export declare function isNil(value: any): boolean;
export declare function isNilOrWriteSpaces(value: string): boolean;
export declare function findEnumByValue(enums: any, value: any): {
    key: string;
    value: any;
} | undefined;
export declare function isObjectId(id: any): id is mongodb.ObjectId;
export declare function mapKeys(object: any, iteratee: (sourceValue: any, sourceKey: string) => string, thisArg?: any): any;
export declare function updateMetadata<TValue, TUpdate>(metadataKey: string, metadataUpdateValue: TUpdate, target: Object, initializer: () => TValue, updater: (value: TValue, update: TUpdate) => TValue, thisArg?: any): TValue;
export declare function convertToRegExp(keyword: any): RegExp;
export declare function objectIdEquals(x: ObjectID, y: ObjectID): boolean;
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
export * from "./lodash-wrapper";
//# sourceMappingURL=utilities.d.ts.map