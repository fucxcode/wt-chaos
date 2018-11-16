import { assert } from "chai";
import * as uuid from "node-uuid";
import * as _ from "../src/utilities";

import { IContainer, Lifecycles } from "../src/container/i-container";
import { registerContainer, clearContainers, resolveContainer } from "../src/container/container";
import { inject, injectable } from "../src/container/decorators";
import { BypassActivationHandler } from "../src/container/activation-handlers/bypass-activation-handler";

describe(`container`, () => {

    let container: IContainer;

    beforeEach(() => {
        clearContainers();
        container = registerContainer(Symbol(), new BypassActivationHandler());
    });

    it(`register a container and resolve`, () => {
        const keys: Symbol[] = [];
        for (let i = 0; i < 3; i++) {
            keys.push(Symbol.for(uuid.v4()));
        }

        const containers: IContainer[] = [];
        for (const key of keys) {
            containers.push(registerContainer(key, new BypassActivationHandler()));
        }

        assert.equal(containers.length, keys.length);
        for (const key of keys) {
            const container = resolveContainer(key);
            assert.ok(container);
            assert.equal(container.key, key);
        }
    });

    interface ITestClass {
        id: string;
        name: string;
    }

    class TestClass implements ITestClass {
        private _id: string;
        public get id(): string {
            return this._id;
        }
        private _name: string;
        public get name(): string {
            return this._name;
        }
        constructor(id: string = uuid.v4(), name?: string) {
            this._id = id;
            this._name = name;
        }
    }

    it(`register as singleton, should resolve the same instance`, () => {
        container.registerType(TestClass, TestClass, Lifecycles.singleton);

        const instances: TestClass[] = [];
        for (let i = 0; i < 10; i++) {
            instances.push(container.resolve(TestClass));
        }
        const id = instances[0].id;
        const first = instances[0];
        for (const instance of instances) {
            assert.equal(instance.id, id);
            assert.equal(instance === first, true);
        }
    });

    it(`register as default lifecycle, should be singleton`, () => {
        container.registerType(TestClass, TestClass);

        const instances: TestClass[] = [];
        for (let i = 0; i < 10; i++) {
            instances.push(container.resolve(TestClass));
        }
        const id = instances[0].id;
        const first = instances[0];
        for (const instance of instances) {
            assert.equal(instance.id, id);
            assert.equal(instance === first, true);
        }
    });

    it(`register as instantiate, should resolve different instance`, () => {
        container.registerType(TestClass, TestClass, Lifecycles.instantiate);

        const instances: TestClass[] = [];
        for (let i = 0; i < 10; i++) {
            instances.push(container.resolve(TestClass));
        }

        const ids = _.map(instances, x => x.id);
        assert.equal(_.uniq(ids).length, instances.length);
    });

    it(`register by symbol, resolve interface`, () => {
        const key = Symbol();
        container.registerType(key, TestClass);

        const instance: ITestClass = container.resolve<ITestClass>(key);
        assert.ok(instance);
    });

    it(`not register, throw error when no register = false, resolve should return undefined and not throw exception`, () => {
        assert.strictEqual(container.resolve(TestClass, false), undefined);
        assert.strictEqual(container.resolve(Symbol(), false), undefined);
    });

    it(`not register, throw error when no register = true | not specify, should throw exception`, () => {
        assert.throws(() => {
            container.resolve(TestClass, true);
        });

        assert.throws(() => {
            container.resolve(TestClass);
        });

        assert.throws(() => {
            container.resolve(Symbol());
        });
    });

    it(`resolve with params, params used in constructor`, () => {
        container.registerType(TestClass, TestClass);

        const id = uuid.v4();
        const name = uuid.v4();
        const instance = container.resolve<TestClass>(TestClass, undefined, id, name);

        assert.ok(instance);
        assert.equal(instance.id, id);
        assert.equal(instance.name, name);
    });

    it(`resolve with params, singleton, return the first instance even though params were different later`, () => {
        container.registerType(TestClass, TestClass);

        const instance = container.resolve<TestClass>(TestClass, undefined, uuid.v4(), uuid.v4());
        for (let i = 0; i < 10; i++) {
            const more = container.resolve<TestClass>(TestClass, undefined, uuid.v4(), uuid.v4());

            assert.ok(more);
            assert.equal(more.id, instance.id);
            assert.equal(more.name, instance.name);
        }
    });

    it(`resolve with params, instantiate, each instances uses its params to construct`, () => {
        container.registerType(TestClass, TestClass, Lifecycles.instantiate);

        const ids: string[] = [];
        const names: string[] = [];
        for (let i = 0; i < 10; i++) {
            const more = container.resolve<TestClass>(TestClass, undefined, uuid.v4(), uuid.v4());

            assert.ok(more);
            ids.push(more.id);
            names.push(more.name);
        }

        assert.equal(_.uniq(ids).length, ids.length);
        assert.equal(_.uniq(names).length, names.length);
    });

    it(`@injectable() should register type and in singleton`, () => {

        @injectable(container)
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

        const ids: string[] = [];
        for (let i = 0; i < 10; i++) {
            const instance = container.resolve<InjectableClass>(InjectableClass);
            ids.push(instance.id);
        }
        assert.equal(_.uniq(ids).length, 1);
    });

    it(`@injectable(singleton) should register type in singleton`, () => {

        @injectable(container, Lifecycles.singleton)
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

        const ids: string[] = [];
        for (let i = 0; i < 10; i++) {
            const instance = container.resolve<InjectableClass>(InjectableClass);
            ids.push(instance.id);
        }
        assert.equal(_.uniq(ids).length, 1);
    });

    it(`@injectable(instantiate) should register type in instantiate`, () => {

        @injectable(container, Lifecycles.instantiate)
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

        const ids: string[] = [];
        for (let i = 0; i < 10; i++) {
            const instance = container.resolve<InjectableClass>(InjectableClass);
            ids.push(instance.id);
        }
        assert.equal(_.uniq(ids).length, ids.length);
    });

    it(`@inject() on property, resolve target type should inject property`, () => {

        @injectable(container)
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

        @injectable(container)
        // @ts-ignore
        class InjectedClass {
            @inject(container)
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

    it(`@inject() on multiple properties, resolve target type should inject each properties`, () => {

        @injectable(container)
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

        @injectable(container)
        // @ts-ignore
        class InjectedClass {
            @inject(container)
            // @ts-ignore
            private _injected1: InjectableClass;
            public get injected1(): InjectableClass {
                return this._injected1;
            }
            @inject(container)
            // @ts-ignore
            private _injected2: InjectableClass;
            public get injected2(): InjectableClass {
                return this._injected2;
            }
            @inject(container)
            // @ts-ignore
            private _injected3: InjectableClass;
            public get injected3(): InjectableClass {
                return this._injected3;
            }
            constructor() {
            }
        }

        const instance = container.resolve<InjectedClass>(InjectedClass);
        assert.ok(instance);
        assert.ok(instance.injected1);
        assert.ok(instance.injected2);
        assert.ok(instance.injected3);
    });


    it(`@inject() on property, new target type with no params, should NOT inject property`, () => {

        @injectable(container)
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

        @injectable(container)
        // @ts-ignore
        class InjectedClass {

            @inject(container)
            // @ts-ignore
            private _injected: InjectableClass;
            public get injected(): InjectableClass {
                return this._injected;
            }
            constructor(injected?: InjectableClass) {
                this._injected = injected;
            }
        }

        const injectedInstance = new InjectedClass();
        assert.ok(injectedInstance);
        assert.equal(injectedInstance.injected, null);
    });

    it(`@inject() on property, new target type with params specified, should NOT inject property`, () => {

        @injectable(container)
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

        @injectable(container)
        // @ts-ignore
        class InjectedClass {
            @inject(container)
            // @ts-ignore
            private _injected: InjectableClass;
            public get injected(): InjectableClass {
                return this._injected;
            }
            constructor(injected?: InjectableClass) {
                this._injected = injected;
            }
        }

        {
            const injectableInstance = new InjectableClass(uuid.v4());
            const injectedInstance = new InjectedClass(injectableInstance);
            assert.ok(injectedInstance);
            assert.equal(injectedInstance.injected.id, injectableInstance.id);
        }

        {
            const injectableInstance = new InjectableClass(uuid.v4());
            const injectedInstance = new InjectedClass(null);
            assert.ok(injectedInstance);
            assert.equal(injectedInstance.injected, null);
        }
    });

    it(`@inject() on constructor params, resolve with no params, injected`, () => {

        @injectable(container)
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

        @injectable(container)
        // @ts-ignore
        class InjectedClass {
            private _injected: InjectableClass;
            public get injected(): InjectableClass {
                return this._injected;
            }
            // @ts-ignore
            constructor(@inject(container) injected?: InjectableClass) {
                this._injected = injected;
            }
        }

        const injectedInstance = container.resolve<InjectedClass>(InjectedClass);
        assert.ok(injectedInstance);
        assert.ok(injectedInstance.injected);
    });

    it(`@inject() on constructor params, resolve with params, not injected`, () => {

        @injectable(container)
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

        @injectable(container)
        // @ts-ignore
        class InjectedClass {
            private _injected: InjectableClass;
            public get injected(): InjectableClass {
                return this._injected;
            }
            // @ts-ignore
            constructor(@inject(container) injected?: InjectableClass) {
                this._injected = injected;
            }
        }

        const injectableInstance = new InjectableClass(uuid.v4());
        const injectedInstance = container.resolve<InjectedClass>(InjectedClass, undefined, injectableInstance);
        assert.ok(injectedInstance);
        assert.ok(injectedInstance.injected);
        assert.equal(injectedInstance.injected.id, injectableInstance.id);
    });

    it(`@inject() on constructor params, resolve with partial params, those not specified params were injected`, () => {

        @injectable(container)
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

        @injectable(container)
        // @ts-ignore
        class InjectedClass {
            private _injected1: InjectableClass;
            public get injected1(): InjectableClass {
                return this._injected1;
            }
            private _injected2: InjectableClass;
            public get injected2(): InjectableClass {
                return this._injected2;
            }
            private _injected3: InjectableClass;
            public get injected3(): InjectableClass {
                return this._injected3;
            }
            // @ts-ignore
            constructor(@inject(container) injected1?: InjectableClass, @inject(container) injected2?: InjectableClass, injected3?: InjectableClass) {
                this._injected1 = injected1;
                this._injected2 = injected2;
                this._injected3 = injected3;
            }
        }

        const injectableInstance1 = new InjectableClass(uuid.v4());
        const injectedInstance = container.resolve<InjectedClass>(InjectedClass, undefined, injectableInstance1);
        assert.ok(injectedInstance);
        assert.ok(injectedInstance.injected1);
        assert.equal(injectedInstance.injected1.id, injectableInstance1.id);
        assert.ok(injectedInstance.injected2);
        assert.equal(injectedInstance.injected3, null);
    });

    it(`@inject() on constructor params, new with partial params, no params were injected`, () => {

        @injectable(container)
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

        @injectable(container)
        // @ts-ignore
        class InjectedClass {
            private _injected1: InjectableClass;
            public get injected1(): InjectableClass {
                return this._injected1;
            }
            private _injected2: InjectableClass;
            public get injected2(): InjectableClass {
                return this._injected2;
            }
            private _injected3: InjectableClass;
            public get injected3(): InjectableClass {
                return this._injected3;
            }
            // @ts-ignore
            constructor(@inject(container) injected1?: InjectableClass, @inject(container) injected2?: InjectableClass, injected3?: InjectableClass) {
                this._injected1 = injected1;
                this._injected2 = injected2;
                this._injected3 = injected3;
            }
        }

        const injectableInstance1 = new InjectableClass(uuid.v4());
        const injectedInstance = new InjectedClass();
        assert.ok(injectedInstance);
        assert.equal(injectedInstance.injected1, null);
        assert.equal(injectedInstance.injected2, null);
        assert.equal(injectedInstance.injected3, null);
    });
});