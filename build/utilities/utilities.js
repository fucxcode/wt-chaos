"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const _ = __importStar(require("./lodash-wrapper"));
const moment_1 = __importDefault(require("moment"));
const constants_1 = require("../constants");
const mongodb = __importStar(require("mongodb"));
const REGEX_OBJECT_ID = new RegExp("^[0-9a-fA-F]{24}$");
function wait(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            return resolve();
        }, milliseconds);
    });
}
exports.wait = wait;
function isNil(value) {
    return _.isNull(value) || _.isUndefined(value);
}
exports.isNil = isNil;
function isNilOrWriteSpaces(value) {
    return isNil(value) || _.trim(value) === ``;
}
exports.isNilOrWriteSpaces = isNilOrWriteSpaces;
function findEnumByValue(enums, value) {
    const key = _.findKey(enums, (x) => x === value);
    if (!_.isEmpty(key)) {
        return {
            key: key,
            value: value
        };
    }
}
exports.findEnumByValue = findEnumByValue;
function isObjectId(id) {
    if (_.isEmpty(id)) {
        return false;
    }
    if (_.isNumber(id)) {
        return false;
    }
    const value = id.toString();
    if (value.length === 24 && REGEX_OBJECT_ID.test(value)) {
        return true;
    }
    else {
        return false;
    }
}
exports.isObjectId = isObjectId;
function mapKeys(object, iteratee, thisArg) {
    let target;
    let sourceKey;
    let sourceValue;
    let targetKey;
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
exports.mapKeys = mapKeys;
function updateMetadata(metadataKey, metadataUpdateValue, target, initializer, updater, thisArg) {
    const existingValue = Reflect.getMetadata(metadataKey, target) || initializer.call(thisArg);
    const newValue = updater.call(thisArg, existingValue, metadataUpdateValue);
    Reflect.defineMetadata(metadataKey, newValue, target);
    return newValue;
}
exports.updateMetadata = updateMetadata;
function convertToRegExp(keyword) {
    return new RegExp(keyword, "i");
}
exports.convertToRegExp = convertToRegExp;
function objectIdEquals(x, y) {
    return (x && y) ? (x.toString() === y.toString()) : false;
}
exports.objectIdEquals = objectIdEquals;
/**
 *  return unique Id in nested array, mostly used for get ids for db query
 */
function flattenId(array, path, prev = []) {
    const keys = path.split(".");
    const depth = keys.length;
    let result = [];
    const build = function (array, keyIndex) {
        if (!array)
            return;
        if (!_.isArray(array)) {
            if (keyIndex === depth - 1) {
                result = result.concat(_.get(array, keys[keyIndex]));
            }
            else {
                const newKey = keyIndex + 1;
                build(_.get(array, keys[keyIndex]), newKey);
            }
        }
        else {
            for (let i = 0; i < array.length; i++) {
                let element = array[i];
                element = element[keys[keyIndex]];
                if (!element) {
                    continue;
                }
                if (keyIndex === depth - 1) {
                    result = result.concat(element);
                }
                else {
                    const newKey = keyIndex + 1;
                    build(element, newKey);
                }
            }
        }
    };
    build(array, 0);
    return _.uniqBy(_.compact(result), x => x && x.toString());
}
exports.flattenId = flattenId;
function toMap(arr, keyResolver, valueResolver) {
    const map = new Map();
    for (const elem of arr) {
        map.set(keyResolver(elem), valueResolver(elem));
    }
    return map;
}
exports.toMap = toMap;
function censor(censor) {
    let i = 0;
    return function (key, value) {
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
exports.censor = censor;
async function nextTick() {
    return new Promise(resolve => {
        process.nextTick(() => {
            return resolve();
        });
    });
}
exports.nextTick = nextTick;
function project(object, projection = [], defaultPicks = ["_id"]) {
    // just return "null" or "undefined" if input "object" is is nil
    // this is because the code below will invoke "_.pick" and "_.omit" on "object" which will be changed to "{}"
    if (isNil(object)) {
        return object;
    }
    // collect properties into picked and omits
    // we will clone the object if nothing to pick or omit
    // otherwise, pick operation has higher priority than omit
    let picks = [];
    let omits = [];
    if (_.isArray(projection)) {
        picks = _.filter(projection, x => !_.isEmpty(x));
    }
    else {
        for (const key in projection) {
            const value = projection[key];
            if (!_.isEmpty(key)) {
                if (value === constants_1.is.yes) {
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
    let output;
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
exports.project = project;
function toSafeDateTimeNumber(date) {
    date = _.isNumber(date) ? date : Number(date);
    if (date.toString().length > 10) {
        return Math.round(date / 1000);
    }
    else {
        return date;
    }
}
exports.toSafeDateTimeNumber = toSafeDateTimeNumber;
function formatFromAndToTimeToTimestampSeconds(from, to, timezone = "Asia/Shanghai", unitOfTime = "day") {
    if (!from && !to) {
        const initFromTimeSeconds = moment_1.default().tz(timezone).startOf(unitOfTime).unix();
        const initToTimeSeconds = moment_1.default().tz(timezone).endOf(unitOfTime).unix();
        return [initFromTimeSeconds, initToTimeSeconds];
    }
    from = moment_1.default(toSafeDateTimeNumber(parseInt(from)), "X").tz(timezone).startOf(unitOfTime).unix();
    to = moment_1.default(toSafeDateTimeNumber(parseInt(to)), "X").tz(timezone).endOf(unitOfTime).unix();
    return [from, to];
}
exports.formatFromAndToTimeToTimestampSeconds = formatFromAndToTimeToTimestampSeconds;
function getIdFromObjectOrId(objectOrId, idResolver) {
    return isObjectId(objectOrId) ? objectOrId : idResolver(objectOrId);
}
exports.getIdFromObjectOrId = getIdFromObjectOrId;
function tryParseObjectId(id, createIfNil = true, objectIdCreator = (id) => new mongodb.ObjectId(id)) {
    try {
        return [true, parseObjectId(id, createIfNil, objectIdCreator)];
    }
    catch (_a) {
        return [false, undefined];
    }
}
exports.tryParseObjectId = tryParseObjectId;
/**
 * parse ObjectId from null, undefined, string or an existing ObjectId
 * it will throw exception when input `id` cannot be parsed
 * if `createIfNil = true` it will create a new ObjectId if `id` is falsy
 * otherwise it will return null or undefined based on input parameter `id`
 * especially, when input `id = ''` and `createIfNil = false` it will return null
 * the 3rd argument `objectIdCreator` should NOT be specified unless in unit test
 */
function parseObjectId(id, createIfNil = true, objectIdCreator = (id) => new mongodb.ObjectId(id)) {
    let objectId;
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
exports.parseObjectId = parseObjectId;
__export(require("./lodash-wrapper"));
//# sourceMappingURL=utilities.js.map