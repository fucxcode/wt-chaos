"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
class CacheKey {
    constructor(team, collectionName, id) {
        this._team = team;
        this._collectionName = collectionName;
        this._id = id;
    }
    get team() {
        return this._team;
    }
    get collectionName() {
        return this._collectionName;
    }
    get id() {
        return this._id;
    }
    toString(prefix = ``) {
        return `${prefix}{${this._team}}${this._collectionName}:${this._id}`;
    }
    toPattern(prefix = ``) {
        let pattern = `{${this._team}}`;
        if (this._collectionName === CacheKey.wildcard) {
            pattern = `${pattern}*`;
        }
        else if (this._id === CacheKey.wildcard) {
            pattern = `${pattern}${this._collectionName}:*`;
        }
        else {
            pattern = this.toString();
        }
        return `${prefix}${pattern}`;
    }
    static parse(value) {
        const posColon = value.indexOf(`:`);
        const posLeftBrace = value.indexOf(`}`);
        const posRightBrace = value.indexOf(`}`);
        if (posColon >= 0 &&
            posLeftBrace >= 0 && posRightBrace >= 0 &&
            posRightBrace > posLeftBrace &&
            posLeftBrace > posColon) {
            return new CacheKey(value.substring(posLeftBrace + 1, posRightBrace), value.substring(posRightBrace + 1, posColon), value.substring(posColon + 1));
        }
        else {
            throw new errors_1.WTError(errors_1.code.invalidInput, "invalid format of cache key", "PREFIX|{TEAM_ID}COLLECTION_NAME:ID", value);
        }
    }
    static tryParse(value) {
        try {
            return [true, CacheKey.parse(value)];
        }
        catch (_a) {
            return [false, null];
        }
    }
}
CacheKey.wildcard = `*`;
exports.CacheKey = CacheKey;
//# sourceMappingURL=cache-key.js.map