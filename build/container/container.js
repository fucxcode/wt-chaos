"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lifecycles;
(function (Lifecycles) {
    Lifecycles[Lifecycles["singleton"] = 1] = "singleton";
    Lifecycles[Lifecycles["instantiate"] = 2] = "instantiate";
})(Lifecycles || (Lifecycles = {}));
exports.Lifecycles = Lifecycles;
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
//# sourceMappingURL=container.js.map