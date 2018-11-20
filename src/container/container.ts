type Type = Function | Symbol;

enum Lifecycles {

    singleton = 1,

    instantiate = 2

}

class ParamType {

    private _type: any;
    public get type(): any {
        return this._type;
    }

    private _container: Container;
    public get container(): Container {
        return this._container;
    }

    constructor(type: any, container: Container) {
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

    private _container: Container;
    public get container(): Container {
        return this._container;
    }

    constructor(key: string, type: any, container: Container) {
        this._key = key;
        this._type = type;
        this._container = container;
    }

}

interface Container {

    key: Symbol;

    registerType(type: Type, ctor: Function, lifecycle?: Lifecycles, paramTypes?: ParamType[], propTypes?: PropertyType[]): Container;

    registerInstance(type: Symbol, instance: any): Container;

    unregister(type: Type): boolean;

    clear(): void;

    resolve<T extends object>(type: Type, throwErrorUnregister?: boolean, ...params: any[]): T | undefined;

}

export { Container, Lifecycles, Type, ParamType, PropertyType };