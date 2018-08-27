"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoCache {
    constructor() {
    }
    async getByKey(key, expireInMilliseconds) {
        return;
    }
    async getByKeys(keys, expireInMilliseconds) {
        return [];
    }
    async setByEntity(value, keyResolver, expireInMilliseconds) {
        return;
    }
    async setByEntities(values, keyResolver, expireInMilliseconds) {
        return [];
    }
    async deleteByKey(key) {
    }
    async deleteByKeys(keys) {
    }
    async deleteByPattern(pattern) {
    }
    async clear() {
    }
}
exports.default = NoCache;
