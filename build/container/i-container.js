"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lifecycles;
(function (lifecycles) {
    lifecycles[lifecycles["singleton"] = 1] = "singleton";
    lifecycles[lifecycles["instantiate"] = 2] = "instantiate";
})(lifecycles || (lifecycles = {}));
exports.lifecycles = lifecycles;
class ParamType {
    get type() {
        return this._type;
    }
    get container() {
        return this._container;
    }
    constructor(type, container) {
        this._type = type;
        this._container = container;
    }
}
exports.ParamType = ParamType;
class PropertyType {
    get key() {
        return this._key;
    }
    get type() {
        return this._type;
    }
    get container() {
        return this._container;
    }
    constructor(key, type, container) {
        this._key = key;
        this._type = type;
        this._container = container;
    }
}
exports.PropertyType = PropertyType;
//# sourceMappingURL=i-container.js.map