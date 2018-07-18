"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const ASYNC_FUNCTION_TAG = "[object AsyncFunction]";
const GENERATOR_FUNCTION_TAG = "[object GeneratorFunction]";
const PROXY_TAG = "[object Proxy]";
function keyBy(collection, iteratee) {
    return lodash_1.default.indexBy(collection, iteratee);
}
exports.keyBy = keyBy;
function filter(collection, predicate) {
    return lodash_1.default.filter(collection, predicate);
}
exports.filter = filter;
function map(collection, iteratee) {
    return lodash_1.default.map(collection, iteratee);
}
exports.map = map;
function forEach(collection, iteratee) {
    return lodash_1.default.forEach(collection, iteratee);
}
exports.forEach = forEach;
function find(collection, predicate, fromIndex) {
    return lodash_1.default.find(collection, predicate, fromIndex);
}
exports.find = find;
function findKey(object, predicate) {
    return lodash_1.default.findKey(object, predicate);
}
exports.findKey = findKey;
function pick(object, paths) {
    return lodash_1.default.pick(object, paths);
}
exports.pick = pick;
function omit(object, paths) {
    return lodash_1.default.omit(object, ...paths);
}
exports.omit = omit;
function isFunction(value) {
    if (!lodash_1.default.isObject(value)) {
        return false;
    }
    if (lodash_1.default.isFunction(value)) {
        return true;
    }
    const tag = Object.prototype.toString.call(value);
    return tag === ASYNC_FUNCTION_TAG || tag === GENERATOR_FUNCTION_TAG || tag === PROXY_TAG;
}
exports.isFunction = isFunction;
function isNull(value) {
    return lodash_1.default.isNull(value);
}
exports.isNull = isNull;
function isUndefined(value) {
    return lodash_1.default.isUndefined(value);
}
exports.isUndefined = isUndefined;
function isNaN(value) {
    return lodash_1.default.isNaN(value);
}
exports.isNaN = isNaN;
function isNumber(value) {
    return lodash_1.default.isNumber(value);
}
exports.isNumber = isNumber;
function isEmpty(value) {
    return lodash_1.default.isEmpty(value);
}
exports.isEmpty = isEmpty;
function trim(value) {
    return lodash_1.default.trim(value);
}
exports.trim = trim;
function sample(collection) {
    return lodash_1.default.sample(collection);
}
exports.sample = sample;
function sampleSize(collection, n) {
    return lodash_1.default.sample(collection, n);
}
exports.sampleSize = sampleSize;
function some(collection, predicate) {
    return lodash_1.default.some(collection, predicate);
}
exports.some = some;
function uniqBy(collection, iteratee) {
    return lodash_1.default.uniq(collection, iteratee);
}
exports.uniqBy = uniqBy;
function uniq(collection) {
    return lodash_1.default.uniq(collection);
}
exports.uniq = uniq;
function keys(object) {
    return lodash_1.default.keys(object);
}
exports.keys = keys;
function sortBy(collection, iteratee) {
    return lodash_1.default.sortBy(collection, iteratee);
}
exports.sortBy = sortBy;
function difference(array, ...values) {
    return lodash_1.default.difference(array, ...values);
}
exports.difference = difference;
function first(array) {
    return lodash_1.default.first(array);
}
exports.first = first;
function isAsyncFunction(value) {
    if (!lodash_1.default.isObject(value)) {
        return false;
    }
    const tag = Object.prototype.toString.call(value);
    return tag === ASYNC_FUNCTION_TAG;
}
exports.isAsyncFunction = isAsyncFunction;
function isArray(value) {
    return lodash_1.default.isArray(value);
}
exports.isArray = isArray;
function isObject(value) {
    return lodash_1.default.isObject(value);
}
exports.isObject = isObject;
function forIn(object, iteratee) {
    return lodash_1.default.forIn(object, iteratee);
}
exports.forIn = forIn;
function isString(value) {
    return lodash_1.default.isString(value);
}
exports.isString = isString;
function assign(object, ...otherArgs) {
    return lodash_1.default.assign(object, ...otherArgs);
}
exports.assign = assign;
function merge(object, source) {
    return lodash_1.default.merge(object, source);
}
exports.merge = merge;
function includes(collection, target, fromIndex) {
    return lodash_1.default.includes(collection, target, fromIndex);
}
exports.includes = includes;
function pull(array, ...values) {
    return lodash_1.default.pull(array, ...values);
}
exports.pull = pull;
function pullAt(array, ...indexes) {
    return lodash_1.default.pullAt(array, ...indexes);
}
exports.pullAt = pullAt;
function findIndex(array, predicate, fromIndex) {
    return lodash_1.default.findIndex(array, predicate, fromIndex);
}
exports.findIndex = findIndex;
function chain(value) {
    return lodash_1.default(value);
}
exports.chain = chain;
function intersection(...arrays) {
    return lodash_1.default.intersection(...arrays);
}
exports.intersection = intersection;
function remove(array, predicate) {
    return lodash_1.default.remove(array, predicate);
}
exports.remove = remove;
function zipObject(props, values) {
    return lodash_1.default.zipObject(props, values);
}
exports.zipObject = zipObject;
function set(object, path, value) {
    return lodash_1.default.set(object, path, value);
}
exports.set = set;
function get(object, path, defaultValue) {
    return lodash_1.default.get(object, path, defaultValue);
}
exports.get = get;
function union(...arrays) {
    return lodash_1.default.union(...arrays);
}
exports.union = union;
function has(object, path) {
    return lodash_1.default.has(object, path);
}
exports.has = has;
function flatten(array) {
    return lodash_1.default.flatten(array);
}
exports.flatten = flatten;
function flattenDeep(array) {
    return lodash_1.default.flattenDeep(array);
}
exports.flattenDeep = flattenDeep;
function compact(array) {
    return lodash_1.default.compact(array);
}
exports.compact = compact;
function truncate(string, opts) {
    return lodash_1.default.truncate();
}
exports.truncate = truncate;
function sum(collection) {
    return lodash_1.default.sum(collection);
}
exports.sum = sum;
function groupBy(collection, iteratee) {
    return lodash_1.default.groupBy(collection, iteratee);
}
exports.groupBy = groupBy;
function random(lower = 0, upper = 1, floating = false) {
    return lodash_1.default.random(lower, upper, floating);
}
exports.random = random;
function repeat(string, n) {
    return lodash_1.default.repeat(string, n);
}
exports.repeat = repeat;
function cloneDeep(value) {
    return lodash_1.default.cloneDeep(value);
}
exports.cloneDeep = cloneDeep;
function values(object) {
    return lodash_1.default.values(object);
}
exports.values = values;
function ceil(n, precision) {
    return lodash_1.default.ceil(n, precision);
}
exports.ceil = ceil;
function take(array, n) {
    return lodash_1.default.take(array, n);
}
exports.take = take;
function forOwn(object, iteratee) {
    return lodash_1.default.forOwn(object, iteratee);
}
exports.forOwn = forOwn;
function startsWith(string, target, position) {
    return lodash_1.default.startsWith(string, target, position);
}
exports.startsWith = startsWith;
function reduce(collection, callback, accumulator) {
    return lodash_1.default.reduce(collection, callback, accumulator);
}
exports.reduce = reduce;
function eq(value, other) {
    return lodash_1.default.eq(value, other);
}
exports.eq = eq;
function clone(value) {
    return lodash_1.default.clone(value);
}
exports.clone = clone;
function noop(...args) {
    return lodash_1.default.noop(...args);
}
exports.noop = noop;
function toPairs(value) {
    return lodash_1.default.pairs(value);
}
exports.toPairs = toPairs;
function fromPairs(value) {
    return lodash_1.default.zipObject(value);
}
exports.fromPairs = fromPairs;
function isEqual(value, other) {
    return lodash_1.default.isEqual(value, other);
}
exports.isEqual = isEqual;
//# sourceMappingURL=lodash-wrapper.js.map