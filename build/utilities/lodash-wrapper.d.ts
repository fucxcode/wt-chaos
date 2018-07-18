import _ from "lodash";
declare type List<T> = ArrayLike<T>;
interface Dictionary<T> {
    [index: string]: T;
}
interface NumericDictionary<T> {
    [index: number]: T;
}
interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {
}
interface ListOfRecursiveArraysOrValues<T> extends List<T | RecursiveArray<T>> {
}
declare type PartialDeep<T> = {
    [P in keyof T]?: PartialDeep<T[P]>;
};
declare type NotVoid = {} | null | undefined;
declare type ListIterator<T, TResult> = (value: T, index: number, collection: List<T>) => TResult;
declare type ObjectIterator<TObject, TResult> = (value: TObject[keyof TObject], key: string, collection: TObject) => TResult;
declare type ObjectIteratee<TObject> = ObjectIterator<TObject, NotVoid> | string | [string, any] | PartialDeep<TObject[keyof TObject]>;
declare type ListIterateeCustom<T, TResult> = ListIterator<T, TResult> | string | object | [string, any] | PartialDeep<T>;
declare type ListIteratee<T> = ListIterator<T, NotVoid> | string | [string, any] | PartialDeep<T>;
declare type ValueIteratee<T> = ((value: T) => NotVoid) | string | [string, any] | PartialDeep<T>;
declare type Many<T> = T | T[];
declare type MemoListIterator<T, TResult, TList> = (prev: TResult, curr: T, index: number, list: TList) => TResult;
export declare function keyBy<T>(collection: List<T> | null | undefined, iteratee: any): Dictionary<T>;
export declare function filter<T>(collection: List<T> | null | undefined, predicate: ListIterateeCustom<T, boolean>): T[];
export declare function map<T, TResult>(collection: List<T> | null | undefined, iteratee: ListIterator<T, TResult>): TResult[];
export declare function forEach<T>(collection: T[], iteratee: ListIterator<T, any>): List<T>;
export declare function find<T>(collection: List<T> | null | undefined, predicate?: ListIterateeCustom<T, boolean>, fromIndex?: number): T | undefined;
export declare function findKey<T>(object: T | null | undefined, predicate: ObjectIteratee<T>): string | undefined;
export declare function pick(object: any, paths: any): any;
export declare function omit(object: any, paths: any): any;
export declare function isFunction(value: any): boolean;
export declare function isNull(value: any): boolean;
export declare function isUndefined(value: any): boolean;
export declare function isNaN(value: any): boolean;
export declare function isNumber(value: any): boolean;
export declare function isEmpty(value: any): boolean;
export declare function trim(value: string): string;
export declare function sample<T>(collection: List<T> | Dictionary<T> | NumericDictionary<T> | null | undefined): T | undefined;
export declare function sampleSize<T>(collection: List<T> | Dictionary<T> | NumericDictionary<T> | null | undefined, n?: number): T[];
export declare function some<T>(collection: List<T> | null | undefined, predicate?: ListIterateeCustom<T, boolean>): boolean;
export declare function uniqBy<T>(collection: List<T> | null | undefined, iteratee: ListIteratee<T>): T[];
export declare function uniq<T>(collection: List<T> | null | undefined): T[];
export declare function keys(object?: any): string[];
export declare function sortBy<T>(collection: List<T> | null | undefined, iteratee: ListIteratee<T>): T[];
export declare function difference<T>(array: List<T> | null | undefined, ...values: Array<List<T>>): T[];
export declare function first<T>(array: List<T> | null | undefined): T | undefined;
export declare function isAsyncFunction(value: any): boolean;
export declare function isArray(value?: any): value is any[];
export declare function isObject(value?: any): boolean;
export declare function forIn<T>(object: T, iteratee?: ObjectIterator<T, any>): T;
export declare function isString(value?: any): value is string;
export declare function assign(object: any, ...otherArgs: any[]): any;
export declare function merge<TObject, TSource>(object: TObject, source: TSource): TObject & TSource;
export declare function includes<T>(collection: List<T> | Dictionary<T> | null | undefined, target: T, fromIndex?: number): boolean;
export declare function pull<T>(array: T[], ...values: T[]): T[];
export declare function pullAt<T>(array: T[], ...indexes: Array<Many<number>>): T[];
export declare function findIndex<T>(array: List<T> | null | undefined, predicate?: ListIterateeCustom<T, boolean>, fromIndex?: number): number;
export declare function chain<T>(value: T): _.LoDashImplicitWrapper<T>;
export declare function intersection<T>(...arrays: Array<List<T>>): T[];
export declare function remove<T>(array: List<T>, predicate?: ListIteratee<T>): T[];
declare type PropertyName = string | number | symbol;
export declare function zipObject<T>(props: List<PropertyName>, values: List<T>): Dictionary<T>;
declare type PropertyPath = Many<PropertyName>;
export declare function set<T extends object>(object: T, path: PropertyPath, value: any): T;
export declare function get<T>(object: any, path: PropertyPath, defaultValue?: T): T;
export declare function union<T>(...arrays: Array<List<T> | null | undefined>): T[];
export declare function has<T>(object: T, path: PropertyPath): boolean;
export declare function flatten<T>(array: List<Many<T>> | null | undefined): T[];
export declare function flattenDeep<T>(array: ListOfRecursiveArraysOrValues<T> | null | undefined): T[];
export declare function compact<T>(array: List<T | null | undefined | false | "" | 0> | null | undefined): T[];
export declare function truncate(string?: string, opts?: {
    length?: number;
    /** The string to indicate text is omitted. */
    omission?: string;
    /** The separator pattern to truncate to. */
    separator?: string | RegExp;
}): string;
export declare function sum(collection: List<any> | null | undefined): number;
export declare function groupBy<T>(collection: List<T> | null | undefined, iteratee?: ValueIteratee<T>): Dictionary<T[]>;
export declare function random(lower?: number, upper?: number, floating?: boolean): number;
export declare function repeat(string?: string, n?: number): string;
export declare function cloneDeep<T>(value: T): T;
export declare function values<T>(object: Dictionary<T> | NumericDictionary<T> | List<T> | null | undefined): T[];
export declare function ceil(n: number, precision?: number): number;
export declare function take<T>(array: List<T> | null | undefined, n?: number): T[];
export declare function forOwn<T>(object: T | null | undefined, iteratee?: ObjectIterator<T, any>): T | null | undefined;
export declare function startsWith(string?: string, target?: string, position?: number): boolean;
export declare function reduce<T, TResult>(collection: List<T> | null | undefined, callback: MemoListIterator<T, TResult, List<T>>, accumulator: TResult): TResult;
export declare function eq(value: any, other: any): boolean;
export declare function clone<T>(value: T): T;
export declare function noop(...args: any[]): void;
export declare function toPairs<T>(value: Dictionary<T>): Array<[string, T]>;
export declare function fromPairs<T>(value: Array<[string, T]>): Dictionary<T>;
export declare function isEqual(value: any, other: any): boolean;
export {};
//# sourceMappingURL=lodash-wrapper.d.ts.map