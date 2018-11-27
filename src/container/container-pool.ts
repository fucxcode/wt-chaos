import * as _ from "../utilities";
import { Container, Lifecycles, Type, ParamType, PropertyType } from "./container";
import { IActivationHandler } from "./activation-handlers/i-activation-handler";
import { BypassActivationHandler } from "./activation-handlers";

class Resolver {

    private _container: Container;

    private _ctor!: FunctionConstructor;

    private _paramTypes!: ParamType[];

    private _propTypes!: PropertyType[];

    private _lifecycle: Lifecycles;
    public get lifecycle(): Lifecycles {
        return this._lifecycle;
    }

    private _postInstantiate: (instance: any) => void;

    private _object: any;

    constructor(container: Container, ctor?: Function, paramTypes: ParamType[] = [], propTypes: PropertyType[] = [], lifecycle: Lifecycles = Lifecycles.singleton, object?: any, postInstantiate: (instance: any) => void = () => { }) {
        this._container = container;
        this._postInstantiate = postInstantiate;
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
            this._postInstantiate(instance);
            return instance;
        }
        else {
            if (_.isUndefined(this._object)) {
                this._object = this.instantiate(params);
                this.injectProperties(this._object);
                this._postInstantiate(this._object);
            }
            return this._object;
        }
    }

}

class ContainerImpl implements Container {

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

    private registerInternal(type: Type, ctor: Function | undefined, lifecycle: Lifecycles, paramTypes: ParamType[] | undefined, propTypes: PropertyType[] | undefined, instance: any | undefined, postInstantiate: (instance: any) => void): Resolver {
        const item = new Resolver(this, ctor, paramTypes, propTypes, lifecycle, instance, postInstantiate);
        this._resolvers.set(type, item);
        return item;
    }

    public registerType(type: Type, ctor: Function | undefined, lifecycle: Lifecycles = Lifecycles.singleton, paramTypes?: ParamType[], propTypes?: PropertyType[], postInstantiate: (instance: any) => void = () => { }): Container {
        this.registerInternal(type, ctor, lifecycle, paramTypes, propTypes, undefined, postInstantiate);
        return this;
    }

    public registerInstance(type: Symbol, instance: any): Container {
        this.registerInternal(type, undefined, Lifecycles.singleton, undefined, undefined, instance, () => { });
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

class ContainerPool {

    private static readonly _containers: Map<Symbol, Container> = new Map<Symbol, Container>();

    private static _defaultContainerKey?: Symbol;

    public static registerContainer(key: Symbol = Symbol(), activationHandler: IActivationHandler = new BypassActivationHandler()): Container {
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

    public static unregisterContainer(key: Symbol, newDefaultContainerKey?: Symbol): boolean {
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

    public static clearContainers(): void {
        ContainerPool._containers.clear();
        ContainerPool._defaultContainerKey = undefined;
    }

    public static resolveContainer(key: Symbol): Container | undefined {
        return ContainerPool._containers.get(key);
    }

    public static getDefaultContainer(): Container | undefined {
        if (ContainerPool._defaultContainerKey) {
            return ContainerPool._containers.get(ContainerPool._defaultContainerKey);
        }
    }

    public static setDefaultContainer(key: Symbol): void {
        if (ContainerPool._containers.has(key)) {
            ContainerPool._defaultContainerKey = key;
        }
        else {
            throw new Error(`Cannot find container with key ${key}.`);
        }
    }

}

export { ContainerPool };