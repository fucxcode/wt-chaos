type Type = Function | Symbol;

enum lifecycles {

    singleton = 1,

    instantiate = 2

}

class ParamType {

    private _type: any;
    public get type(): any {
        return this._type;
    }

    private _container: IContainer;
    public get container(): IContainer {
        return this._container;
    }

    constructor(type: any, container: IContainer) {
        this._type = type;
        this._container = container;
    }

}

class PropertyType {

    private _key: string;
    public get key(): string {
        return this._key;
    }

    private _type: any;
    public get type(): any {
        return this._type;
    }

    private _container: IContainer;
    public get container(): IContainer {
        return this._container;
    }

    constructor(key: string, type: any, container: IContainer) {
        this._key = key;
        this._type = type;
        this._container = container;
    }

}

interface IContainer {

    key: Symbol;

    registerType(type: Type, ctor: Function, lifecycle?: lifecycles, paramTypes?: ParamType[], propTypes?: PropertyType[]): IContainer;

    registerInstance(type: Symbol, instance: any): IContainer;

    unregister(type: Type): boolean;

    clear(): void;

    resolve<T extends object>(type: Type, throwErrorUnregister?: boolean, ...params: any[]): T;

}

export { IContainer, lifecycles, Type, ParamType, PropertyType };