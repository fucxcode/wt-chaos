import _ from "lodash";

const ASYNC_FUNCTION_TAG = "[object AsyncFunction]";
const GENERATOR_FUNCTION_TAG = "[object GeneratorFunction]";
const PROXY_TAG = "[object Proxy]";

type List<T> = ArrayLike<T>;

interface Dictionary<T> {
    [index: string]: T;
}

interface NumericDictionary<T> {
    [index: number]: T;
}

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> { }
interface ListOfRecursiveArraysOrValues<T> extends List<T | RecursiveArray<T>> { }

type PartialDeep<T> = {
    [P in keyof T]?: PartialDeep<T[P]>;
};

type NotVoid = {} | null | undefined;

type ListIterator<T, TResult> = (value: T, index: number, collection: List<T>) => TResult;

type ObjectIterator<TObject, TResult> = (value: TObject[keyof TObject], key: string, collection: TObject) => TResult;

type ObjectIteratee<TObject> = ObjectIterator<TObject, NotVoid> | string | [string, any] | PartialDeep<TObject[keyof TObject]>;

type ListIterateeCustom<T, TResult> = ListIterator<T, TResult> | string | object | [string, any] | PartialDeep<T>;

type ListIteratee<T> = ListIterator<T, NotVoid> | string | [string, any] | PartialDeep<T>;

type ValueIteratee<T> = ((value: T) => NotVoid) | string | [string, any] | PartialDeep<T>;

type Many<T> = T | T[];

type MemoListIterator<T, TResult, TList> = (prev: TResult, curr: T, index: number, list: TList) => TResult;

type ObjectIterateeCustom<TObject, TResult> = ObjectIterator<TObject, TResult> | string | [string, any] | PartialDeep<TObject[keyof TObject]>;

export function keyBy<T>(collection: List<T> | null | undefined, iteratee: any): Dictionary<T> {
    return _.keyBy(collection, iteratee);
}

export function filter<T>(collection: List<T> | null | undefined, predicate: ListIterateeCustom<T, boolean>): T[] {
    return _.filter<T>(collection, predicate);
}

export function map<T, TResult>(collection: List<T> | null | undefined, iteratee: ListIterator<T, TResult>): TResult[] {
    return _.map<T, TResult>(collection, iteratee);
}

export function forEach<T>(collection: T[], iteratee: ListIterator<T, any>): List<T> {
    return _.forEach<T>(collection, iteratee);
}

export function find<T>(collection: List<T> | null | undefined, predicate?: ListIterateeCustom<T, boolean>, fromIndex?: number): T | undefined {
    return _.find(collection, predicate, fromIndex);
}

export function findKey<T>(object: T | null | undefined, predicate: ObjectIteratee<T>): string | undefined {
    return _.findKey<T>(object, predicate);
}

export function pick(object: any, paths: any): any {
    return _.pick(object, paths);
}

export function omit(object: any, paths: any): any {
    return _.omit(object, ...paths);
}

export function isFunction(value: any): boolean {
    if (!_.isObject(value)) {
        return false;
    }
    if (_.isFunction(value)) {
        return true;
    }
    const tag = Object.prototype.toString.call(value);
    return tag === ASYNC_FUNCTION_TAG || tag === GENERATOR_FUNCTION_TAG || tag === PROXY_TAG;
}

export function isNull(value: any): boolean {
    return _.isNull(value);
}

export function isUndefined(value: any): boolean {
    return _.isUndefined(value);
}

export function isNaN(value: any): boolean {
    return _.isNaN(value);
}

export function isNumber(value: any): boolean {
    return _.isNumber(value);
}

export function isEmpty(value: any): boolean {
    return _.isEmpty(value);
}

export function trim(value: string): string {
    return _.trim(value);
}

export function sample<T>(collection: List<T> | Dictionary<T> | NumericDictionary<T> | null | undefined): T | undefined {
    return _.sample(collection);
}

export function sampleSize<T>(collection: List<T> | Dictionary<T> | NumericDictionary<T> | null | undefined, n?: number): T[] {
    return _.sampleSize(collection, n);
}

// function some<T>(collection: T[], predicate?: (value: T) => boolean): boolean;
function some<T>(collection: List<T> | null | undefined, predicate?: ListIterateeCustom<T, boolean>): boolean;
function some<T extends object>(collection: T | null | undefined, predicate?: ObjectIterateeCustom<T, boolean> ): boolean;
function some(collection: any, predicate?: any): boolean {
    return _.some(collection, predicate);
}
export { some };

export function uniqBy<T>(collection: List<T> | null | undefined, iteratee: ValueIteratee<T>): T[] {
    return _.uniqBy(collection, iteratee);
}


export function uniq<T>(collection: List<T> | null | undefined): T[] {
    return _.uniq(collection);
}

export function keys(object?: any): string[] {
    return _.keys(object);
}

export function sortBy<T>(collection: List<T> | null | undefined, iteratee: ListIteratee<T>): T[] {
    return _.sortBy(collection, iteratee);
}

export function difference<T>(array: List<T> | null | undefined, ...values: Array<List<T>>): T[] {
    return _.difference(array, ...values);
}

export function first<T>(array: List<T> | null | undefined): T | undefined {
    return _.first(array);
}

export function isAsyncFunction(value: any): boolean {
    if (!_.isObject(value)) {
        return false;
    }
    const tag = Object.prototype.toString.call(value);
    return tag === ASYNC_FUNCTION_TAG;
}

export function isArray(value?: any): value is any[] {
    return _.isArray(value);
}

export function isObject(value?: any): boolean {
    return _.isObject(value);
}

export function forIn<T>(object: T, iteratee?: ObjectIterator<T, any>): T {
    return _.forIn<T>(object, iteratee);
}

export function isString(value?: any): value is string {
    return _.isString(value);
}

export function assign(object: any, ...otherArgs: any[]): any {
    return _.assign(object, ...otherArgs);
}

export function merge<TObject, TSource1, TSource2>(
    object: TObject,
    source1: TSource1,
    source2: TSource2
): TObject & TSource1 & TSource2;
export function merge<TObject, TSource>(object: TObject, source1: TSource): TObject & TSource;
export function merge(object: any, ...otherArgs: any[]): any {
    return _.merge(object, ...otherArgs);
}

export function includes<T>(collection: List<T> | Dictionary<T> | null | undefined, target: T, fromIndex?: number): boolean {
    return _.includes(collection, target, fromIndex);
}

export function pull<T>(array: T[], ...values: T[]): T[] {
    return _.pull(array, ...values);
}

export function pullAt<T>(array: T[], ...indexes: Array<Many<number>>) {
    return _.pullAt(array, ...indexes);
}

export function findIndex<T>(array: List<T> | null | undefined, predicate?: ListIterateeCustom<T, boolean>, fromIndex?: number): number {
    return _.findIndex(array, predicate, fromIndex);
}

export function chain<T>(value: T): _.LoDashImplicitWrapper<T> {
    return _<T>(value);
}

export function intersection<T>(...arrays: Array<List<T>>): T[] {
    return _.intersection(...arrays);
}

export function remove<T>(array: List<T>, predicate?: ListIteratee<T>): T[] {
    return _.remove(array, predicate);
}

type PropertyName = string | number | symbol;

export function zipObject<T>(props: List<PropertyName>, values: List<T>): Dictionary<T> {
    return _.zipObject<T>(props, values);
}

type PropertyPath = Many<PropertyName>;

export function set<T extends object>(
    object: T,
    path: PropertyPath,
    value: any
): T {
    return _.set<T>(object, path, value);
}

export function get<T>(
    object: any,
    path: PropertyPath,
    defaultValue?: T
): T {
    return _.get(object, path, defaultValue);
}

export function union<T>(...arrays: Array<List<T> | null | undefined>): T[] {
    return _.union(...arrays);
}

export function has<T>(object: T, path: PropertyPath): boolean {
    return _.has(object, path);
}

export function flatten<T>(array: List<Many<T>> | null | undefined): T[] {
    return _.flatten(array);
}

export function flattenDeep<T>(array: ListOfRecursiveArraysOrValues<T> | null | undefined): T[] {
    return _.flattenDeep<T>(array);
}

export function compact<T>(array: List<T | null | undefined | false | "" | 0> | null | undefined): T[] {
    return _.compact(array);
}

export function truncate(string?: string, opts?: {
    length?: number;
    /** The string to indicate text is omitted. */
    omission?: string;
    /** The separator pattern to truncate to. */
    separator?: string | RegExp;
}) {
    return _.truncate();
}

export function sum(collection: List<any> | null | undefined): number {
    return _.sum(collection);
}

export function groupBy<T>(collection: List<T> | null | undefined, iteratee?: ValueIteratee<T>): Dictionary<T[]> {
    return _.groupBy(collection, iteratee);
}

export function random(lower: number = 0, upper: number = 1, floating: boolean = false): number {
    return _.random(lower, upper, floating);
}

export function repeat(string?: string, n?: number): string {
    return _.repeat(string, n);
}

export function cloneDeep<T>(value: T): T {
    return _.cloneDeep(value);
}

export function values<T>(object: Dictionary<T> | NumericDictionary<T> | List<T> | null | undefined): T[] {
    return _.values(object);
}

export function ceil(n: number, precision?: number): number {
    return _.ceil(n, precision);
}

export function take<T>(array: List<T> | null | undefined, n?: number): T[] {
    return _.take<T>(array, n);
}

export function forOwn<T>(object: T | null | undefined, iteratee?: ObjectIterator<T, any>): T | null | undefined {
    return _.forOwn<T>(object, iteratee);
}

export function startsWith(string?: string, target?: string, position?: number): boolean {
    return _.startsWith(string, target, position);
}

export function reduce<T, TResult>(collection: List<T> | null | undefined, callback: MemoListIterator<T, TResult, List<T>>, accumulator: TResult): TResult {
    return _.reduce(collection, callback, accumulator);
}

export function eq(value: any, other: any): boolean {
    return _.eq(value, other);
}

export function clone<T>(value: T): T {
    return _.clone(value);
}

export function noop(...args: any[]): void {
    return _.noop(...args);
}

export function toPairs<T>(value: Dictionary<T>): Array<[string, T]> {
    return _.toPairs(value);
}

export function fromPairs<T>(value: Array<[string, T]>): Dictionary<T> {
    return _.fromPairs(value);
}

export function isEqual(value: any, other: any): boolean {
    return _.isEqual(value, other);
}

export function chunk<T>(arr?: T[], size?: number): T[][] {
    return _.chunk<T>(arr, size);
}

export function shuffle<T>(collection: List<T> | null | undefined): T[] {
    return _.shuffle<T>(collection);
}