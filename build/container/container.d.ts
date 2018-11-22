declare type Type = Function | Symbol;
declare enum Lifecycles {
    singleton = 1,
    instantiate = 2
}
declare class ParamType {
    private _type;
    readonly type: any;
    private _container;
    readonly container: Container;
    constructor(type: any, container: Container);
}
declare class PropertyType {
    private _key;
    readonly key: string;
    private _type;
    readonly type: any;
    private _container;
    readonly container: Container;
    constructor(key: string, type: any, container: Container);
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
