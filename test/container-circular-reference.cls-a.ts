import { injectable, inject } from "../src/container/decorators";
import { TYPES, container } from "./container-circular-reference.types";
import B from "./container-circular-reference.cls-b";

@injectable(container, undefined, TYPES.A)
// @ts-ignore
export default class A {

    public get name(): string {
        return "A";
    }

    @inject(container, undefined, TYPES.B)
    // @ts-ignore
    private _b1: B;
    public get b1(): B {
        return this._b1;
    }

    @inject(container, undefined, TYPES.B, true)
    // @ts-ignore
    private _b2: B;
    public get b2(): B {
        return this._b2;
    }
}
