import * as _ from "../utilities";
import { IContainer, Lifecycles, Type, ParamType, PropertyType } from "./i-container";
import { IActivationHandler } from "./activation-handlers/i-activation-handler";

class Resolver {

    private _container: IContainer;

    private _ctor!: FunctionConstructor;

    private _paramTypes!: ParamType[];

    private _propTypes!: PropertyType[];

    private _lifecycle: Lifecycles;
    public get lifecycle(): Lifecycles {
        return this._lifecycle;
    }

    private _object: any;

    constructor(container: IContainer, ctor?: Function, paramTypes: ParamType[] = [], propTypes: PropertyType[] = [], lifecycle: Lifecycles = Lifecycles.singleton, object?: any) {
        this._container = container;
        if (object) {
            this._object = object;
            this._lifecycle = Lifecycles.singleton;
        }
        else {
            this._ctor = <FunctionConstructor>ctor;
            this._paramTypes = paramTypes;
            this._propTypes = propTypes;
            this._lifecycle = lifecycle;
        }
    }

    private instantiate(params?: any[]): any {
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
        return (params ? new this._ctor(...params) : new this._ctor()) as any;
    }

    private injectProperties(instance: any) {
        if (_.some(this._propTypes)) {
            for (const propType of this._propTypes) {
                if (_.isUndefined(instance[propType.key])) {
                    instance[propType.key] = propType.container.resolve(propType.type);
                }
            }
        }
    }

    public resolve(params?: any[]): any {
        if (this._lifecycle === Lifecycles.instantiate) {
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

class Container implements IContainer {

    private _key: Symbol;
    public get key(): Symbol {
        return this._key;
    }

    private _resolvers: Map<Type, Resolver>;

    private _activationHandler: IActivationHandler;

    constructor(key: Symbol, activationHandler: IActivationHandler) {
        this._key = key;
        this._resolvers = new Map<Type, Resolver>();
        this._activationHandler = activationHandler;
    }

    private registerInternal(type: Type, ctor: Function | undefined, lifecycle: Lifecycles, paramTypes?: ParamType[], propTypes?: PropertyType[], instance?: any): Resolver {
        const item = new Resolver(this, ctor, paramTypes, propTypes, lifecycle, instance);
        this._resolvers.set(type, item);
        return item;
    }

    public registerType(type: Type, ctor: Function | undefined, lifecycle: Lifecycles = Lifecycles.singleton, paramTypes?: ParamType[], propTypes?: PropertyType[]): IContainer {
        this.registerInternal(type, ctor, lifecycle, paramTypes, propTypes);
        return this;
    }

    public registerInstance(type: Symbol, instance: any): IContainer {
        this.registerInternal(type, undefined, Lifecycles.singleton, undefined, undefined, instance);
        return this;
    }

    public unregister(type: Type): boolean {
        return this._resolvers.delete(type);
    }

    public clear(): void {
        this._resolvers.clear();
    }

    public resolve<T extends object>(type: Type, throwErrorUnregister: boolean = true, ...params: any[]): T | undefined {
        const resolver = this._resolvers.get(type);

        if (resolver) {
            return this._activationHandler.handle<T>(resolver.resolve(params));
        }
        else {
            if (throwErrorUnregister) {
                throw new Error(`cannot resolve type ${type && type.toString()} from container`);
            }
        }
    }
}

const containers: Map<Symbol, IContainer> = new Map<Symbol, IContainer>();
let defaultContainerKey: Symbol | null = null;

const registerContainer = function (key: Symbol, activationHandler: IActivationHandler): IContainer {
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

const unregisterContainer = function (key: Symbol, newDefaultContainerKey?: Symbol): boolean {
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

const clearContainers = function (): void {
    containers.clear();
    defaultContainerKey = null;
};

const resolveContainer = function (key: Symbol): IContainer | undefined {
    return containers.get(key);
};

const getDefaultContainer = function (): IContainer | undefined {
    if (defaultContainerKey) {
        return containers.get(defaultContainerKey);
    }
};

const setDefaultContainer = function (key: Symbol): void {
    if (containers.has(key)) {
        defaultContainerKey = key;
    }
    else {
        throw new Error(`Cannot find container with key ${key}.`);
    }
};

export { registerContainer, unregisterContainer, clearContainers, resolveContainer, getDefaultContainer, setDefaultContainer };