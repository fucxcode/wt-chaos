import { Entity } from "../entities";
import { Direction } from "../../constants";
import * as _ from "../../utilities";

type Index<T extends Entity> = {
    [key in keyof T]: Direction
};

const index = function <T extends Entity>(index: Index<T>) {
    return function (target: any) {
        _.updateMetadata<Index<T>[], Index<T>>("wt-entity-idx", index, target, () => [], (v, u) => v.concat([u]));
        return target;
    };
};

const getIndexesFromEntity = function <T extends Entity>(type: any): Index<T>[] {
    return Reflect.getMetadata("wt-entity-idx", type);
};

export { index, getIndexesFromEntity };