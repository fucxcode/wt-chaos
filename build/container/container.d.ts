import { IContainer } from "./i-container";
import { IActivationHandler } from "./activation-handlers/i-activation-handler";
declare const registerContainer: (key: Symbol, activationHandler: IActivationHandler) => IContainer;
declare const unregisterContainer: (key: Symbol, newDefaultContainerKey?: Symbol | undefined) => boolean;
declare const clearContainers: () => void;
declare const resolveContainer: (key: Symbol) => IContainer | undefined;
declare const getDefaultContainer: () => IContainer | undefined;
declare const setDefaultContainer: (key: Symbol) => void;
export { registerContainer, unregisterContainer, clearContainers, resolveContainer, getDefaultContainer, setDefaultContainer };
