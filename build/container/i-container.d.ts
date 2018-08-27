declare type Type = Function | Symbol;
declare enum lifecycles {
    singleton = 1,
    instantiate = 2
}
declare class ParamType {
    private _type;
    readonly type: any;
    private _container;
    readonly container: IContainer;
    constructor(type: any, container: IContainer);
}
declare class PropertyType {
    private _key;
    readonly key: string;
    private _type;
    readonly type: any;
    private _container;
    readonly container: IContainer;
    constructor(key: string, type: any, container: IContainer);
}
interface IContainer {
    key: Symbol;
    registerType(type: Type, ctor: Function, lifecycle?: lifecycles, paramTypes?: ParamType[], propTypes?: PropertyType[]): IContainer;
    registerInstance(type: Symbol, instance: any): IContainer;
    unregister(type: Type): boolean;
    clear(): void;
    resolve<T extends object>(type: Type, throwErrorUnregister?: boolean, ...params: any[]): T | undefined;
}
export { IContainer, lifecycles, Type, ParamType, PropertyType };
