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
const container_1 = require("./container");
const activation_handlers_1 = require("./activation-handlers");
class Resolver {
    get lifecycle() {
        return this._lifecycle;
    }
    constructor(container, ctor, paramTypes = [], propTypes = [], lifecycle = container_1.Lifecycles.singleton, object) {
        this._container = container;
        if (object) {
            this._object = object;
            this._lifecycle = container_1.Lifecycles.singleton;
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
        if (this._lifecycle === container_1.Lifecycles.instantiate) {
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
class ContainerImpl {
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
    registerType(type, ctor, lifecycle = container_1.Lifecycles.singleton, paramTypes, propTypes) {
        this.registerInternal(type, ctor, lifecycle, paramTypes, propTypes);
        return this;
    }
    registerInstance(type, instance) {
        this.registerInternal(type, undefined, container_1.Lifecycles.singleton, undefined, undefined, instance);
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
class ContainerPool {
    static registerContainer(key = Symbol(), activationHandler = new activation_handlers_1.BypassActivationHandler()) {
        const container = new ContainerImpl(key, activationHandler);
        if (ContainerPool._containers.has(key)) {
            throw new Error(`Duplicated key for containers`);
        }
        else {
            ContainerPool._containers.set(key, container);
            // set this container as default is there's no default container
            if (!ContainerPool._defaultContainerKey) {
                ContainerPool._defaultContainerKey = key;
            }
            return container;
        }
    }
    static unregisterContainer(key, newDefaultContainerKey) {
        if (ContainerPool._defaultContainerKey === key) {
            if (newDefaultContainerKey) {
                ContainerPool.setDefaultContainer(newDefaultContainerKey);
                return ContainerPool._containers.delete(key);
            }
            else {
                throw new Error(`Cannot delete default container ${key} due to 'newDefaultContainerKey' is null.`);
            }
        }
        else {
            return ContainerPool._containers.delete(key);
        }
    }
    static clearContainers() {
        ContainerPool._containers.clear();
        ContainerPool._defaultContainerKey = undefined;
    }
    static resolveContainer(key) {
        return ContainerPool._containers.get(key);
    }
    static getDefaultContainer() {
        if (ContainerPool._defaultContainerKey) {
            return ContainerPool._containers.get(ContainerPool._defaultContainerKey);
        }
    }
    static setDefaultContainer(key) {
        if (ContainerPool._containers.has(key)) {
            ContainerPool._defaultContainerKey = key;
        }
        else {
            throw new Error(`Cannot find container with key ${key}.`);
        }
    }
}
ContainerPool._containers = new Map();
exports.ContainerPool = ContainerPool;
//# sourceMappingURL=container-pool.js.map