import { IActivationHandler } from "./i-activation-handler";

class BypassActivationHandler implements IActivationHandler {

    public handle<T extends object>(instance: T): T {
        return instance;
    }

}

export { BypassActivationHandler };
