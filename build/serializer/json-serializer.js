"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSONSerializer {
    serialize(value) {
        return JSON.stringify(value);
    }
    deserialize(buf) {
        return buf && JSON.parse(buf);
    }
}
exports.JSONSerializer = JSONSerializer;
