import "reflect-metadata";
import * as _ from "./lodash-wrapper";
import moment from "moment";
import { ObjectID, is, Projection, ObjectOrId } from "../constants";
import * as mongodb from "mongodb";

const REGEX_OBJECT_ID = new RegExp("^[0-9a-fA-F]{24}$");

export function wait(milliseconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            return resolve();
        }, milliseconds);
    });
}

export function isNil(value: any): boolean {
    return _.isNull(value) || _.isUndefined(value);
}

export function isNilOrWriteSpaces(value: any): boolean {
    return isNil(value) || _.trim(value) === ``;
}

export function findEnumByValue(enums: any, value: any): {
    key: string,
    value: any
} | undefined {
    const key = _.findKey(enums, (x: any) => x === value);
    if (!_.isEmpty(key)) {
        return {
            key: key as string,
            value: value
        };
    }
}

export function isObjectId(id: any): id is mongodb.ObjectId {
    if (_.isEmpty(id)) {
        return false;
    }
    if (_.isNumber(id)) {
        return false;
    }
    const value = id.toString();
    if (value.length === 24 && REGEX_OBJECT_ID.test(value)) {
        return true;
    } else {
        return false;
    }
}

export function mapKeys(object: any, iteratee: (sourceValue: any, sourceKey: string) => string, thisArg?: any): any {
    let target: any;
    let sourceKey: string;
    let sourceValue: any;
    let targetKey: string;

    if (_.isArray(object)) {
        target = [];
        object.forEach(function (element) {
            target.push(mapKeys(element, iteratee, thisArg));
        });
    }
    else if (isObjectId(object)) {
        target = object;
    }
    else if (_.isObject(object)) {
        target = {};
        for (sourceKey in object) {
            if (object && object.hasOwnProperty(sourceKey)) {
                sourceValue = object[sourceKey];
                targetKey = iteratee.call(thisArg, sourceValue, sourceKey);
                target[targetKey] = mapKeys(sourceValue, iteratee, thisArg);
            }
        }
    }
    else {
        target = object;
    }

    return target;
}

export function updateMetadata<TValue, TUpdate>(metadataKey: string, metadataUpdateValue: TUpdate, target: Object, initializer: () => TValue, updater: (value: TValue, update: TUpdate) => TValue, thisArg?: any): TValue {
    const existingValue: TValue = Reflect.getMetadata(metadataKey, target) || initializer.call(thisArg);
    const newValue = updater.call(thisArg, existingValue, metadataUpdateValue);
    Reflect.defineMetadata(metadataKey, newValue, target);
    return newValue;
}

export function convertToRegExp(keyword: any): RegExp {
    return new RegExp(keyword, "i");
}

export function objectIdEquals(x: ObjectID, y: ObjectID): boolean {
    return (x && y) ? (x.toString() === y.toString()) : false;
}

/**
 *  return unique Id in nested array, mostly used for get ids for db query
 */
export function flattenId(array: Array<any>, path: string, prev: ObjectID[] = []): Array<ObjectID> {
    const keys = path.split(".");
    const depth = keys.length;
    let result: ObjectID[] = [];

    const build = function (array: Array<any>, keyIndex: number) {
        if (!array) return;
        if (!_.isArray(array)) {
            if (keyIndex === depth - 1) {
                result = result.concat(_.get(array, keys[keyIndex]));
            } else {
                const newKey = keyIndex + 1;
                build(_.get(array, keys[keyIndex]), newKey);
            }
        } else {
            for (let i = 0; i < array.length; i++) {
                let element = array[i];
                element = element[keys[keyIndex]];
                if (!element) {
                    continue;
                }
                if (keyIndex === depth - 1) {
                    result = result.concat(element);
                } else {
                    const newKey = keyIndex + 1;
                    build(element, newKey);
                }
            }
        }
    };
    build(array, 0);
    return _.uniqBy(_.compact(result), x => x && x.toString());
}

export function toMap<T, TKey, TValue>(arr: T[], keyResolver: (elem: T) => TKey, valueResolver: (elem: T) => TValue): Map<TKey, TValue> {
    const map = new Map<TKey, TValue>();
    for (const elem of arr) {
        map.set(keyResolver(elem), valueResolver(elem));
    }
    return map;
}

export function censor(censor: any): any {
    let i = 0;
    return function (key: any, value: any): any {
        if (i !== 0 && typeof (censor) !== `object` && typeof (value) === `object` && censor === value) {
            return `[Circular]`;
        }
        if (i >= 29) {
            return `[Unknown]`;
        }
        ++i;
        return value;
    };
}

export async function nextTick(): Promise<void> {
    return new Promise<void>(resolve => {
        process.nextTick(() => {
            return resolve();
        });
    });
}

export function project<T extends object>(object: T, projection: Projection<T> = [], defaultPicks: string[] = ["_id"]): T {
    // just return "null" or "undefined" if input "object" is is nil
    // this is because the code below will invoke "_.pick" and "_.omit" on "object" which will be changed to "{}"
    if (isNil(object)) {
        return object;
    }

    // collect properties into picked and omits
    // we will clone the object if nothing to pick or omit
    // otherwise, pick operation has higher priority than omit
    let picks: (keyof T)[] = [];
    let omits: (keyof T)[] = [];
    if (_.isArray(projection)) {
        picks = _.filter(projection as (keyof T)[], x => !_.isEmpty(x));
    }
    else {
        for (const key in projection as { [key in keyof T]: is; }) {
            const value = projection[key];
            if (!_.isEmpty(key)) {
                if (value === is.yes) {
                    picks.push(key);
                }
                else {
                    omits.push(key);
                }
            }
        }
    }
    // currently we only support pick or omit on the top level of properties
    // i.e. it's ok to pick and omit "_id", "name", "created_at"
    // but it's NOT support for "archive.archvied_by", "properties.assignee.value", "watchers.$.uid"
    picks = _.chain(picks).filter(x => !_.isEmpty(x)).uniq().valueOf();
    omits = _.chain(omits).filter(x => !_.isEmpty(x)).uniq().valueOf();
    // map object properties based on picks and omits
    let output: T;
    if (_.some(picks)) {
        output = _.pick(object, picks);
    }
    else if (_.some(omits)) {
        output = _.omit(object, omits);
    }
    else {
        output = _.clone(object);
    }
    // attach default pick properties if specified
    // note that the default picks should ignore those omitted explicitly
    const defaults = _.filter(defaultPicks, p => !_.some(omits, o => o === p));
    if (_.some(defaults)) {
        output = _.assign(output, _.pick(object, defaults));
    }
    return output;
}

export function toSafeDateTimeNumber(date: number): number {
    date = _.isNumber(date) ? date : Number(date);
    if (date.toString().length > 10) {
        return Math.round(date / 1000);
    }
    else {
        return date;
    }
}

export function formatFromAndToTimeToTimestampSeconds(from?: string | number, to?: string | number, timezone: string = "Asia/Shanghai", unitOfTime: any = "day"): Array<number> {
    if (!from && !to) {
        const initFromTimeSeconds = moment().tz(timezone).startOf(unitOfTime).unix();
        const initToTimeSeconds = moment().tz(timezone).endOf(unitOfTime).unix();
        return [initFromTimeSeconds, initToTimeSeconds];
    }
    from = moment(toSafeDateTimeNumber(parseInt(<string>from)), "X").tz(timezone).startOf(unitOfTime).unix();
    to = moment(toSafeDateTimeNumber(parseInt(<string>to)), "X").tz(timezone).endOf(unitOfTime).unix();
    return [from, to];
}

export function getIdFromObjectOrId<T>(objectOrId: ObjectOrId<T>, idResolver: (obj: T) => mongodb.ObjectId): mongodb.ObjectId {
    return isObjectId(objectOrId) ? objectOrId as mongodb.ObjectId : idResolver(objectOrId as T);
}

export function tryParseObjectId(id?: ObjectID | null | undefined, createIfNil: boolean = true, objectIdCreator: (id?: string | number | mongodb.ObjectId) => mongodb.ObjectId = (id) => new mongodb.ObjectId(id)): [boolean, mongodb.ObjectId | null | undefined] {
    try {
        return [true, parseObjectId(id, createIfNil, objectIdCreator)];
    }
    catch {
        return [false, undefined];
    }
}

/**
 * parse ObjectId from null, undefined, string or an existing ObjectId
 * it will throw exception when input `id` cannot be parsed
 * if `createIfNil = true` it will create a new ObjectId if `id` is falsy
 * otherwise it will return null or undefined based on input parameter `id`
 * especially, when input `id = ''` and `createIfNil = false` it will return null
 * the 3rd argument `objectIdCreator` should NOT be specified unless in unit test
 */
export function parseObjectId(id?: ObjectID | null | undefined, createIfNil: boolean = true, objectIdCreator: (id?: string | number | mongodb.ObjectId) => mongodb.ObjectId = (id) => new mongodb.ObjectId(id)): mongodb.ObjectId | null | undefined {
    let objectId: mongodb.ObjectId | null | undefined;
    if (id) {
        if (_.isString(id)) {
            objectId = objectIdCreator(id);
        }
        else {
            objectId = id;
        }
    }
    else {
        if (createIfNil) {
            objectId = objectIdCreator();
        }
        else {
            if (_.isNull(id) || _.isString(id)) {
                objectId = null;
            }
            else {
                // leave `objectID` as undefined
            }
        }
    }
    return objectId;
}

export function asyncify(fn: (...args: any[]) => any): (...args: any[]) => Promise<any> {
    return (...args: any[]): Promise<any> => Promise.resolve(fn(...args));
}

export * from "./lodash-wrapper";