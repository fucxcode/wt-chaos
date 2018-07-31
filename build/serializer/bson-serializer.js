"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
class BSONSerializer {
    constructor() {
        this._bson = new bson_1.BSON();
    }
    serialize(value) {
        return this._bson.serialize(value);
    }
    deserialize(buf) {
        return buf && this._bson.deserialize(buf);
    }
}
exports.BSONSerializer = BSONSerializer;
//# sourceMappingURL=bson-serializer.js.map