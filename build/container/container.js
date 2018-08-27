"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../utilities"));
const i_container_1 = require("./i-container");
// import { BypassActivationHandler } from "./activation-handlers/bypass-activation-handler";
// import { ActivityTracingActivationHandler } from "./activation-handlers/tracing-activation-handler";
class Resolver {
    get lifecycle() {
        return this._lifecycle;
    }
    constructor(container, ctor, paramTypes = [], propTypes = [], lifecycle = i_container_1.lifecycles.singleton, object) {
        this._container = container;
        if (object) {
            this._object = object;
            this._lifecycle = i_container_1.lifecycles.singleton;
        }
        else {
            this._ctor = ctor;
            this._paramTypes = paramTypes;
            this._propTypes = propTypes;
            this._lifecycle = lifecycle;
        }
    }
    instantiate(params) {
        if (_.some(this._paramTypes)) {
            params = params || [];
            for (let i = 0; i < this._paramTypes.length; i++) {
                if (_.isUndefined(params[i]) && !_.isNil(this._paramTypes[i])) {
                    const container = this._paramTypes[i].container;
                    const type = this._paramTypes[i].type;
                    params[i] = container.resolve(type);
                }
            }
        }
        return (params ? new this._ctor(...params) : new this._ctor());
    }
    injectProperties(instance) {
        if (_.some(this._propTypes)) {
            for (const propType of this._propTypes) {
                if (_.isUndefined(instance[propType.key])) {
                    instance[propType.key] = propType.container.resolve(propType.type);
                }
            }
        }
    }
    resolve(params) {
        if (this._lifecycle === i_container_1.lifecycles.instantiate) {
            const instance = this.instantiate(params);
            this.injectProperties(instance);
            return instance;
        }
        else {
            if (_.isUndefined(this._object)) {
                this._object = this.instantiate(params);
                this.injectProperties(this._object);
            }
            return this._object;
        }
    }
}
class Container {
    get key() {
        return this._key;
    }
    constructor(key, activationHandler) {
        this._key = key;
        this._resolvers = new Map();
        this._activationHandler = activationHandler;
    }
    registerInternal(type, ctor, lifecycle, paramTypes, propTypes, instance) {
        const item = new Resolver(this, ctor, paramTypes, propTypes, lifecycle, instance);
        this._resolvers.set(type, item);
        return item;
    }
    registerType(type, ctor, lifecycle = i_container_1.lifecycles.singleton, paramTypes, propTypes) {
        this.registerInternal(type, ctor, lifecycle, paramTypes, propTypes);
        return this;
    }
    registerInstance(type, instance) {
        this.registerInternal(type, undefined, i_container_1.lifecycles.singleton, undefined, undefined, instance);
        return this;
    }
    unregister(type) {
        return this._resolvers.delete(type);
    }
    clear() {
        this._resolvers.clear();
    }
    resolve(type, throwErrorUnregister = true, ...params) {
        const resolver = this._resolvers.get(type);
        if (resolver) {
            return this._activationHandler.handle(resolver.resolve(params));
        }
        else {
            if (throwErrorUnregister) {
                throw new Error(`cannot resolve type ${type && type.toString()} from container`);
            }
        }
    }
}
const containers = new Map();
let defaultContainerKey = null;
const registerContainer = function (key, activationHandler) {
    const container = new Container(key, activationHandler);
    if (containers.has(key)) {
        throw new Error(`Duplicated key for containers`);
    }
    else {
        containers.set(key, container);
        // set this container as default is there's no default container
        if (!defaultContainerKey) {
            defaultContainerKey = key;
        }
        return container;
    }
};
exports.registerContainer = registerContainer;
const unregisterContainer = function (key, newDefaultContainerKey) {
    if (defaultContainerKey === key) {
        if (newDefaultContainerKey) {
            setDefaultContainer(newDefaultContainerKey);
            return containers.delete(key);
        }
        else {
            throw new Error(`Cannot delete default container ${key} due to 'newDefaultContainerKey' is null.`);
        }
    }
    else {
        return containers.delete(key);
    }
};
exports.unregisterContainer = unregisterContainer;
const clearContainers = function () {
    containers.clear();
    defaultContainerKey = null;
};
exports.clearContainers = clearContainers;
const resolveContainer = function (key) {
    return containers.get(key);
};
exports.resolveContainer = resolveContainer;
const getDefaultContainer = function () {
    if (defaultContainerKey) {
        return containers.get(defaultContainerKey);
    }
};
exports.getDefaultContainer = getDefaultContainer;
const setDefaultContainer = function (key) {
    if (containers.has(key)) {
        defaultContainerKey = key;
    }
    else {
        throw new Error(`Cannot find container with key ${key}.`);
    }
};
exports.setDefaultContainer = setDefaultContainer;
//# sourceMappingURL=container.js.map