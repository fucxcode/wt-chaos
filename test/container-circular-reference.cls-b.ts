import { injectable, inject } from "../src/container/decorators";
import { TYPES, container } from "./container-circular-reference.types";
import A from "./container-circular-reference.cls-a";

@injectable(container, undefined, TYPES.B)
// @ts-ignore
export default class B {

    public get name(): string {
        return "B";
    }

    @inject(container, undefined, TYPES.A)
    // @ts-ignore
    private _a1: A;
    public get a1(): A {
        return this._a1;
    }

    @inject(container, undefined, TYPES.A, true)
    // @ts-ignore
    private _a2: A;
    public get a2(): A {
        return this._a2;
    }
}
