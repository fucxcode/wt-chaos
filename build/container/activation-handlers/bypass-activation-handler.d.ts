import { IActivationHandler } from "./i-activation-handler";
declare class BypassActivationHandler implements IActivationHandler {
    handle<T extends object>(instance: T): T;
}
export { BypassActivationHandler };
