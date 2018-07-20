import { IContainer } from "./i-container";
import { IActivationHandler } from "./activation-handlers/i-activation-handler";
declare const registerContainer: (key: Symbol, activationHandler: IActivationHandler) => IContainer;
declare const unregisterContainer: (key: Symbol) => boolean;
declare const clearContainers: () => void;
declare const resolveContainer: (key: Symbol) => IContainer | undefined;
export { registerContainer, unregisterContainer, clearContainers, resolveContainer };
