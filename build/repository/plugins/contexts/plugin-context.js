"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PluginContext {
    constructor(operationDescription, driverName, collectionName, name, defaultResult) {
        this._operationDescription = operationDescription;
        this._collectionName = collectionName;
        this._driverName = driverName;
        this._name = name;
        this._properties = new Map();
        this._cancel = false;
        this._result = defaultResult;
    }
    get operationDescription() {
        return this._operationDescription;
    }
    get collectionName() {
        return this._collectionName;
    }
    get driverName() {
        return this._driverName;
    }
    get name() {
        return this._name;
    }
    get cancel() {
        return this._cancel;
    }
    set cancel(value) {
        this._cancel = value;
    }
    get result() {
        return this._result;
    }
    set result(value) {
        this._result = value;
    }
    setProperty(key, value) {
        this._properties.set(key, value);
    }
    getProperty(key) {
        return this._properties.get(key);
    }
}
exports.PluginContext = PluginContext;
//# sourceMappingURL=plugin-context.js.map