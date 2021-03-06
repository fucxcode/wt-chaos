import { defaultValue, applyEntityDefaultValues, OperationDescription, MongoDBId, Id, MongoDBDriver } from "../src/repository";
import * as _ from "../src/utilities";
import { assert } from "chai";
import * as uuid from "node-uuid";
import { UID } from "../src/constants";
import * as TypeMoq from "typemoq";
import * as mongodb from "mongodb";

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
        const actual = applyEntityDefaultValues<Entity>(Entity, {
            stringPropNoDef: def.stringPropNoDef,
            numberPropNoDef: def.numberPropNoDef,
            booleanPropNoDef: def.booleanPropNoDef
        }, undefined, undefined);

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

        const actual = applyEntityDefaultValues<Entity>(Entity, {
            numberProp: null
        }, undefined, undefined);

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
        const actual = applyEntityDefaultValues<Entity>(Entity, {
            stringProp: assignedString
        }, undefined, undefined);

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

        const actual = applyEntityDefaultValues<Entity>(Entity, {}, undefined, undefined);

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

        const actual = applyEntityDefaultValues<Entity>(Entity, {}, undefined, undefined);

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

        const actual = applyEntityDefaultValues<Entity>(Entity, {}, undefined, undefined);

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

        const actual = applyEntityDefaultValues<Entity>(Entity, {}, undefined, undefined);

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
        const actual = applyEntityDefaultValues<Entity>(Entity, {
            stringArray: arr
        }, undefined, undefined);

        assert.deepStrictEqual(actual.stringArray, arr);
    });

    it(`array, simple element type, default-value is empty array, assigned`, async () => {

        const expects = [];

        class Entity {

            @defaultValue(() => expects)
            // @ts-ignore
            stringArray?: string[];

        }

        const actual = applyEntityDefaultValues<Entity>(Entity, {}, undefined, undefined);

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

        const actual = applyEntityDefaultValues<Entity>(Entity, {}, undefined, undefined);

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

        const actual = applyEntityDefaultValues<Entity>(Entity, {}, undefined, undefined);

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

        const actual = applyEntityDefaultValues<Entity>(Entity, {}, undefined, undefined);

        assert.ok(actual.obj1);
        assert.deepStrictEqual(actual.obj1.arr, expects);
    });

    it(`use operation description`, async () => {

        const operationDescription = new OperationDescription(uuid.v4(), new MongoDBId(), uuid.v4());

        class Entity {

            @defaultValue(o => o.team)
            // @ts-ignore
            team?: Id;

            @defaultValue(o => o.uid)
            // @ts-ignore
            created_by?: UID;

        }

        const actual = applyEntityDefaultValues<Entity>(Entity, {}, operationDescription, undefined);

        assert.strictEqual(actual.team.toString(), operationDescription.team.toString());
        assert.strictEqual(actual.created_by, operationDescription.uid);
    });

    it(`use id resolver`, async () => {

        const dbMock = TypeMoq.Mock.ofType<mongodb.Db>();
        const clientMock = TypeMoq.Mock.ofType<mongodb.MongoClient>();
        clientMock.setup(x => x.db(TypeMoq.It.isAny())).returns(() => dbMock.object);
        const driver = new MongoDBDriver(clientMock.object, "__test__");

        class Entity {

            @defaultValue((od, ir) => ir())
            // @ts-ignore
            _id?: Id;

        }

        const actual = applyEntityDefaultValues<Entity>(Entity, {}, undefined, (id?: Id) => driver.parseId(id, true));

        assert.ok(actual._id);
        assert.isTrue(driver.isValidId(actual._id));
    });

    it(`use parent class default values`, async () => {

        const expects = {
            stringProp: _.randomString(),
            numberProp: _.random(0, 9999),
            booleanProp: _.sample([true, false])
        };

        class Parent {

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

        class Child extends Parent {

        }

        const actual = applyEntityDefaultValues<Child>(Child, {}, undefined, undefined);

        assert.strictEqual(actual.stringProp, expects.stringProp);
        assert.strictEqual(actual.numberProp, expects.numberProp);
        assert.strictEqual(actual.booleanProp, expects.booleanProp);
    });

    it(`override parent class default values`, async () => {

        const expects_parent = {
            stringProp: _.randomString(),
            numberProp: _.random(0, 9999),
            booleanProp: _.sample([true, false])
        };

        class Parent {

            @defaultValue(() => expects_parent.stringProp)
            // @ts-ignore
            stringProp?: string;

            @defaultValue(() => expects_parent.numberProp)
            // @ts-ignore
            numberProp?: number;

            @defaultValue(() => expects_parent.booleanProp)
            // @ts-ignore
            booleanProp?: boolean;

        }

        const expects_child = {
            stringProp: _.randomString()
        };

        class Child extends Parent {

            @defaultValue(() => expects_child.stringProp)
            // @ts-ignore
            stringProp?: string;

        }

        const actual = applyEntityDefaultValues<Child>(Child, {}, undefined, undefined);

        assert.strictEqual(actual.stringProp, expects_child.stringProp);
        assert.strictEqual(actual.numberProp, expects_parent.numberProp);
        assert.strictEqual(actual.booleanProp, expects_parent.booleanProp);
    });

});