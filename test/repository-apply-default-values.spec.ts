import { defaultValue, applyDefaultValues } from "../src/repository";
import * as _ from "../src/utilities";

describe("repository: apply default values", () => {

    it(`simple default values`, async () => {

        const expect = {
            name: _.randomString(8, "alphabetic"),
            age: _.random(18, 36),
            is_deleted: _.sample([true, false])
        };

        class ArrItem {

            skill?: string;

            @defaultValue(() => "nice!")
            // @ts-ignore
            level?: string;

        }

        class SubObject {

            id?: string;

            @defaultValue(() => 100)
            // @ts-ignore
            price?: number;

            @defaultValue(() => {
                return [{}, {}];
            }, ArrItem)
            // @ts-ignore
            items?: ArrItem[];


        }

        class MyObject {

            @defaultValue(() => {
                return [
                    {},
                    {},
                    {}
                ];
            }, ArrItem)
            // @ts-ignore
            skills?: ArrItem[];

            @defaultValue(() => expect.name)
            // @ts-ignore
            name?: string;

            @defaultValue(() => expect.age)
            // @ts-ignore
            age?: number;

            @defaultValue(() => expect.is_deleted)
            // @ts-ignore
            is_deleted?: boolean;

            @defaultValue(() => [
                {}, {}
            ], SubObject)
            // @ts-ignore
            subs?: SubObject[];

        }

        const actual: MyObject = {};
        applyDefaultValues(MyObject, actual);
        console.log(JSON.stringify(actual, null, 2));

        // console.log(Reflect.getMetadataKeys(MyObject));
    });

});