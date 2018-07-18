import { registerContainer } from "../src/container/container";
import { BypassActivationHandler } from "../src/container/activation-handlers/bypass-activation-handler";

const TYPES = {
    A: Symbol.for("A"),
    B: Symbol.for("B")
};

const container = registerContainer(Symbol(), new BypassActivationHandler());

export { TYPES, container };