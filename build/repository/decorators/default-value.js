"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../../utilities"));
class DefaultValueEntry {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
const defaultValue = function (value, arrayGenericType) {
    return function (target, propertyKey) {
        const typeToStore = arrayGenericType || Reflect.getMetadata("design:type", target, propertyKey);
        _.updateMetadata("wt-entity-defaults", value(), target.constructor, () => new Map(), (v, u) => {
            const map = new Map(v);
            map.set(propertyKey, new DefaultValueEntry(typeToStore, u));
            return map;
        });
    };
};
exports.defaultValue = defaultValue;
const applyDefaultValues = function (type, object) {
    const defaults = Reflect.getMetadata("wt-entity-defaults", type);
    if (defaults) {
        for (const [key, entry] of defaults.entries()) {
            // set default when it's NOT defined in "entity" (is undefined)
            // and the default value is NOT undefined
            // not need to check if the key of default value does exist in "entity" since user may not specify
            if (_.isUndefined(_.get(object, key)) && !_.isUndefined(entry.value)) {
                if (_.isArray(entry.value)) {
                    // "_.isArray" MUST be checked before "_.isObject" since an array always be an object
                    _.set(object, key, _.map(entry.value, x => applyDefaultValues(entry.type, x)));
                }
                else if (_.isObject(entry.value)) {
                    _.set(object, key, applyDefaultValues(entry.type, entry.value));
                }
                else {
                    _.set(object, key, entry.value);
                }
            }
        }
    }
    return object;
};
exports.applyDefaultValues = applyDefaultValues;
//# sourceMappingURL=default-value.js.map