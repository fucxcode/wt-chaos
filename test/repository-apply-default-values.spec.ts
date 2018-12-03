import { defaultValue, applyDefaultValues } from "../src/repository";
import * as _ from "../src/utilities";
import { assert } from "chai";

describe("repository: apply default values", () => {

    it(`simple types, undefined prop should had default assigned`, async () => {

        const expects = {
            stringProp: _.randomString(),
            numberProp: _.random(0, 9999),
            booleanProp: _.sample([true, false])
        };

        class Entity {

            @defaultValue(() => expects.stringProp)
            // @ts-ignore
            stringProp?: string;

            @defaultValue(() => expects.numberProp)
            // @ts-ignore
            numberProp?: number;

            @defaultValue(() => expects.booleanProp)
            // @ts-ignore
            booleanProp?: boolean;

            stringPropNoDef?: string;
            numberPropNoDef?: number;
            booleanPropNoDef?: boolean;

        }

        const def = {
            stringPropNoDef: _.randomString(),
            numberPropNoDef: _.random(10000, 20000),
            booleanPropNoDef: _.sample([true, false])
        };
        const actual = applyDefaultValues<Entity>(Entity, {
            stringPropNoDef: def.stringPropNoDef,
            numberPropNoDef: def.numberPropNoDef,
            booleanPropNoDef: def.booleanPropNoDef
        });

        assert.strictEqual(actual.stringProp, expects.stringProp);
        assert.strictEqual(actual.numberProp, expects.numberProp);
        assert.strictEqual(actual.booleanProp, expects.booleanProp);
        assert.strictEqual(actual.stringPropNoDef, def.stringPropNoDef);
        assert.strictEqual(actual.numberPropNoDef, def.numberPropNoDef);
        assert.strictEqual(actual.booleanPropNoDef, def.booleanPropNoDef);
    });

    it(`simple types, null prop should NOT had default assigned`, async () => {

        const expects = {
            stringProp: _.randomString(),
            numberProp: _.random(0, 10000),
            booleanProp: _.sample([true, false])
        };

        class Entity {

            @defaultValue(() => expects.stringProp)
            // @ts-ignore
            stringProp?: string;

            @defaultValue(() => expects.numberProp)
            // @ts-ignore
            numberProp?: number;

            @defaultValue(() => expects.booleanProp)
            // @ts-ignore
            booleanProp?: boolean;

        }

        const actual = applyDefaultValues<Entity>(Entity, {
            numberProp: null
        });

        assert.strictEqual(actual.stringProp, expects.stringProp);
        assert.isNull(actual.numberProp);
        assert.strictEqual(actual.booleanProp, expects.booleanProp);
    });

    it(`simple types, value-assigned prop should NOT had default assigned`, async () => {

        const expects = {
            stringProp: _.randomString(),
            numberProp: _.random(0, 10000),
            booleanProp: _.sample([true, false])
        };

        class Entity {

            @defaultValue(() => expects.stringProp)
            // @ts-ignore
            stringProp?: string;

            @defaultValue(() => expects.numberProp)
            // @ts-ignore
            numberProp?: number;

            @defaultValue(() => expects.booleanProp)
            // @ts-ignore
            booleanProp?: boolean;

        }

        const assignedString = _.randomString();
        const actual = applyDefaultValues<Entity>(Entity, {
            stringProp: assignedString
        });

        assert.strictEqual(actual.stringProp, assignedString);
        assert.strictEqual(actual.numberProp, expects.numberProp);
        assert.strictEqual(actual.booleanProp, expects.booleanProp);
    });

    it(`simple types, default-value is undefined, should NOT assign`, async () => {

        const expects = {
            stringProp: _.randomString(),
            numberProp: undefined,
            booleanProp: _.sample([true, false])
        };

        class Entity {

            @defaultValue(() => expects.stringProp)
            // @ts-ignore
            stringProp?: string;

            @defaultValue(() => expects.numberProp)
            // @ts-ignore
            numberProp?: number;

            @defaultValue(() => expects.booleanProp)
            // @ts-ignore
            booleanProp?: boolean;

        }

        const actual = applyDefaultValues<Entity>(Entity, {});

        assert.strictEqual(actual.stringProp, expects.stringProp);
        assert.isUndefined(actual.numberProp);
        assert.strictEqual(actual.booleanProp, expects.booleanProp);
    });

    it(`simple types, default-value is null, should assign`, async () => {

        const expects = {
            stringProp: _.randomString(),
            numberProp: null,
            booleanProp: _.sample([true, false])
        };

        class Entity {

            @defaultValue(() => expects.stringProp)
            // @ts-ignore
            stringProp?: string;

            @defaultValue(() => expects.numberProp)
            // @ts-ignore
            numberProp?: number;

            @defaultValue(() => expects.booleanProp)
            // @ts-ignore
            booleanProp?: boolean;

        }

        const actual = applyDefaultValues<Entity>(Entity, {});

        assert.strictEqual(actual.stringProp, expects.stringProp);
        assert.isNull(actual.numberProp);
        assert.strictEqual(actual.booleanProp, expects.booleanProp);
    });

    it(`simple types, default-value is empty string, zero, false, should assign`, async () => {

        const expects = {
            stringProp: "",
            numberProp: 0,
            booleanProp: false
        };

        class Entity {

            @defaultValue(() => expects.stringProp)
            // @ts-ignore
            stringProp?: string;

            @defaultValue(() => expects.numberProp)
            // @ts-ignore
            numberProp?: number;

            @defaultValue(() => expects.booleanProp)
            // @ts-ignore
            booleanProp?: boolean;

        }

        const actual = applyDefaultValues<Entity>(Entity, {});

        assert.strictEqual(actual.stringProp, expects.stringProp);
        assert.strictEqual(actual.numberProp, expects.numberProp);
        assert.strictEqual(actual.booleanProp, expects.booleanProp);
    });

    it(`array, simple element type, default-value is array, assigned`, async () => {

        const expects = [
            _.randomString(),
            _.randomString(),
            _.randomString(),
            _.randomString(),
            _.randomString(),
        ];

        class Entity {

            @defaultValue(() => expects)
            // @ts-ignore
            stringArray?: string[];

        }

        const actual = applyDefaultValues<Entity>(Entity, {});

        assert.deepStrictEqual(actual.stringArray, expects);
    });

    it(`array, simple element type, value-assigned, default value NOT assigned`, async () => {

        const expects = [
            _.randomString(),
            _.randomString(),
            _.randomString(),
            _.randomString(),
            _.randomString(),
        ];

        class Entity {

            @defaultValue(() => expects)
            // @ts-ignore
            stringArray?: string[];

        }

        const arr = [
            _.randomString(),
            _.randomString(),
        ];
        const actual = applyDefaultValues<Entity>(Entity, {
            stringArray: arr
        });

        assert.deepStrictEqual(actual.stringArray, arr);
    });

    it(`array, simple element type, default-value is empty array, assigned`, async () => {

        const expects = [];

        class Entity {

            @defaultValue(() => expects)
            // @ts-ignore
            stringArray?: string[];

        }

        const actual = applyDefaultValues<Entity>(Entity, {});

        assert.deepStrictEqual(actual.stringArray, expects);
    });

    it(`class, simple prop types, default-value is specified, assigned`, async () => {

        const expects = {
            stringProp: _.randomString(),
            numberProp: _.random(0, 10000),
            booleanProp: _.sample([true, false])
        };

        class Obj1 {

            @defaultValue(() => expects.stringProp)
            // @ts-ignore
            stringProp?: string;

            @defaultValue(() => expects.numberProp)
            // @ts-ignore
            numberProp?: number;

            @defaultValue(() => expects.booleanProp)
            // @ts-ignore
            booleanProp?: boolean;

        }

        class Entity {

            @defaultValue(() => new Object())
            // @ts-ignore
            obj1?: Obj1;

        }

        const actual = applyDefaultValues<Entity>(Entity, {});

        assert.ok(actual.obj1);
        assert.deepStrictEqual(actual.obj1, expects);
    });

    it(`class, array prop types, default-value is specified, assigned`, async () => {

        const expects = [
            _.randomString(),
            _.randomString(),
            _.randomString(),
            _.randomString(),
            _.randomString()
        ];

        class Obj1 {

            @defaultValue(() => expects)
            // @ts-ignore
            arr?: string[];

        }

        class Entity {

            @defaultValue(() => new Object())
            // @ts-ignore
            obj1?: Obj1;

        }

        const actual = applyDefaultValues<Entity>(Entity, {});

        assert.ok(actual.obj1);
        assert.deepStrictEqual(actual.obj1.arr, expects);
    });

    it(`class, array class prop types, default-value is specified, assigned`, async () => {

        class Obj2 {

            constructor(public stringProp: string) {
            }

        }

        const expects = [
            new Obj2(_.randomString()),
            new Obj2(_.randomString()),
            new Obj2(_.randomString()),
            new Obj2(_.randomString()),
            new Obj2(_.randomString())
        ];

        class Obj1 {

            @defaultValue(() => expects, Obj2)
            // @ts-ignore
            arr?: Obj2[];

        }

        class Entity {

            @defaultValue(() => new Object())
            // @ts-ignore
            obj1?: Obj1;

        }

        const actual = applyDefaultValues<Entity>(Entity, {});

        assert.ok(actual.obj1);
        assert.deepStrictEqual(actual.obj1.arr, expects);
    });

});