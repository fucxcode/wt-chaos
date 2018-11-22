import { Container } from "./container";
import { IActivationHandler } from "./activation-handlers/i-activation-handler";
declare class ContainerPool {
    private static readonly _containers;
    private static _defaultContainerKey?;
    static registerContainer(key?: Symbol, activationHandler?: IActivationHandler): Container;
    static unregisterContainer(key: Symbol, newDefaultContainerKey?: Symbol): boolean;
    static clearContainers(): void;
    static resolveContainer(key: Symbol): Container | undefined;
    static getDefaultContainer(): Container | undefined;
    static setDefaultContainer(key: Symbol): void;
}
export { ContainerPool };
