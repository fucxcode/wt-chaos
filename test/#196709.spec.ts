import { ContainerPool, injectable, inject } from "../src/container";
import { assert } from "chai";

const container = ContainerPool.registerContainer();

describe("#196709", () => {

    @injectable()
    // @ts-ignore
    class InjectedClassA {

        public name: string;

        constructor() {
            this.name = "A";
        }

    }

    @injectable()
    // @ts-ignore
    class InjectedClassB {

        public name: string;

        constructor() {
            this.name = "B";
        }

    }

    @injectable()
    // @ts-ignore
    class ParentClass {

        @inject()
        // @ts-ignore
        public injected: InjectedClassA;

    }

    @injectable()
    // @ts-ignore
    class SubClass extends ParentClass {

        @inject()
        // @ts-ignore
        public injected: InjectedClassB;

    }

    it(`should inject property defined in sub class rather than parent class`, () => {

        const resolvedSubClass = container.resolve<SubClass>(SubClass);
        assert.strictEqual(resolvedSubClass.injected.name, "B");

    });

});

