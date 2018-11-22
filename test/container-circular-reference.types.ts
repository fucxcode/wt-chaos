import { ContainerPool } from "../src/container";
import { BypassActivationHandler } from "../src/container/activation-handlers/bypass-activation-handler";

const TYPES = {
    A: Symbol.for("A"),
    B: Symbol.for("B")
};

const container = ContainerPool.registerContainer(Symbol(), new BypassActivationHandler());

export { TYPES, container };