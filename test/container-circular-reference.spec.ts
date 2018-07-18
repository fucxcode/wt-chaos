import * as assert from "assert";

import { TYPES, container } from "./container-circular-reference.types";

import A from "./container-circular-reference.cls-a";
import B from "./container-circular-reference.cls-b";

// below statements just ensure TypeScript will emit modules below
// https://stackoverflow.com/questions/49296588/
A;
B;

describe(`container: circular reference`, () => {

    it(`inject and lazy inject, use @injectable to register with symbol type identifier, properties should be injected`, () => {
        const a = container.resolve<A>(TYPES.A);
        assert.ok(a);
        assert.strictEqual(a.name, "A");
        assert.ok(a.b1);
        assert.strictEqual(a.b1.name, "B");
        assert.ok(a.b2);
        assert.strictEqual(a.b2.name, "B");

        const b = container.resolve<B>(TYPES.B);
        assert.ok(b);
        assert.strictEqual(b.name, "B");
        assert.ok(b.a1);
        assert.strictEqual(b.a1.name, "A");
        assert.ok(b.a2);
        assert.strictEqual(b.a2.name, "A");
    });

});