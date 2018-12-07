import { Entity } from "../entities";
import { Direction } from "../../constants";
import * as _ from "../../utilities";

type Index<T extends Entity> = {
    [key in keyof T]?: Direction
};

interface IndexSpecification<T extends Entity> {

    key: Index<T>;

    name?: string;

    background?: boolean;

    unique?: boolean;

}

const indexes = function <T extends Entity>(indexes: Array<IndexSpecification<T> | Index<T>>) {
    return function (target: any) {
        _.updateMetadata<IndexSpecification<T>[], Array<IndexSpecification<T> | Index<T>>>("wt-entity-idx", indexes, target, () => [], (v, u) => {
            return v.concat(_.map(u, x => {
                if (_.has(x, "key") && _.isObject(_.get(x, "key"))) {
                    return x as unknown as IndexSpecification<T>;
                }
                else {
                    return {
                        key: x as unknown as Index<T>
                    };
                }
            }));
        });
        return target;
    };
};

const getIndexesFromEntity = function <T extends Entity>(type: any): IndexSpecification<T>[] {
    return Reflect.getMetadata("wt-entity-idx", type);
};

export { indexes, getIndexesFromEntity, Index, IndexSpecification };