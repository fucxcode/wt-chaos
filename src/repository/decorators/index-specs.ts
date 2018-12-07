import { Entity } from "../entities";
import { Direction } from "../../constants";
import * as _ from "../../utilities";

type Index<T extends Entity> = {
    [key in keyof T]: Direction
};

interface IndexSpecification<T extends Entity> {

    key: Index<T>;

    name?: string;

    background?: boolean;

    unique?: boolean;

}

const indexes = function <T extends Entity>(indexes: IndexSpecification<T>[]) {
    return function (target: any) {
        Reflect.defineMetadata("wt-entity-idx", indexes, target);
        return target;
    };
};

const getIndexesFromEntity = function <T extends Entity>(type: any): IndexSpecification<T>[] {
    return Reflect.getMetadata("wt-entity-idx", type);
};

export { indexes, getIndexesFromEntity, Index, IndexSpecification };