import { assert } from "chai";
import * as uuid from "node-uuid";
import * as _ from "../src/utilities";

import { ContainerPool } from "../src/container";
import { inject, injectable } from "../src/container/decorators";
import { BypassActivationHandler } from "../src/container/activation-handlers/bypass-activation-handler";

describe(`default container`, () => {

    beforeEach(() => {
        ContainerPool.clearContainers();
    });

    it(`register 1st container, set default. inject and injectable should use default container`, () => {
        const key = Symbol("default");
        const container = ContainerPool.registerContainer(key, new BypassActivationHandler());
        ContainerPool.setDefaultContainer(key);

        @injectable()
        // @ts-ignore
        class InjectableClass {
            private _id: string;
            public get id(): string {
                return this._id;
            }
            constructor(id: string = uuid.v4()) {
                this._id = id;
            }
        }

        @injectable()
        // @ts-ignore
        class InjectedClass {
            @inject()
            // @ts-ignore
            private _injected: InjectableClass;
            public get injected(): InjectableClass {
                return this._injected;
            }
            constructor() {
            }
        }

        const instance = container.resolve<InjectedClass>(InjectedClass);
        assert.ok(instance);
        assert.ok(instance.injected);
    });

    it(`register 1st container, no default. inject and injectable should use this container as default`, () => {
        const key = Symbol("default");
        const container = ContainerPool.registerContainer(key, new BypassActivationHandler());

        @injectable()
        // @ts-ignore
        class InjectableClass {
            private _id: string;
            public get id(): string {
                return this._id;
            }
            constructor(id: string = uuid.v4()) {
                this._id = id;
            }
        }

        @injectable()
        // @ts-ignore
        class InjectedClass {
            @inject()
            // @ts-ignore
            private _injected: InjectableClass;
            public get injected(): InjectableClass {
                return this._injected;
            }
            constructor() {
            }
        }

        const instance = container.resolve<InjectedClass>(InjectedClass);
        assert.ok(instance);
        assert.ok(instance.injected);
    });

    it(`no register container. inject and injectable should raise exception`, () => {
        assert.throw(() => {
            @injectable()
            // @ts-ignore
            class InjectableClass {
                private _id: string;
                public get id(): string {
                    return this._id;
                }
                constructor(id: string = uuid.v4()) {
                    this._id = id;
                }
            }

            @injectable()
            // @ts-ignore
            class InjectedClass {
                @inject()
                // @ts-ignore
                private _injected: InjectableClass;
                public get injected(): InjectableClass {
                    return this._injected;
                }
                constructor() {
                }
            }
        });
    });
});