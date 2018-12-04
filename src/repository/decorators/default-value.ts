import * as _ from "../../utilities";
import { OperationDescription } from "../operation-desc";
import { Id } from "../entities";

type DefaultValueType<T> = (operationDescription: OperationDescription, idResolver: (id?: Id) => Id | null | undefined) => T;

class DefaultValueEntry<T> {

    constructor(
        public type: Function,
        public value: DefaultValueType<T>
    ) {}

}

const defaultValue = function <T>(value: DefaultValueType<T>, arrayGenericType?: Function) {
    return function (target: any, propertyKey: string): any {
        const typeToStore: Function = arrayGenericType || Reflect.getMetadata("design:type", target, propertyKey);
        _.updateMetadata<Map<string, DefaultValueEntry<T>>, DefaultValueType<T>>("wt-entity-defaults", value, target.constructor, () => new Map<string, DefaultValueEntry<T>>(), (v, u) => {
            const map = new Map<string, DefaultValueEntry<T>>(v);
            map.set(propertyKey, new DefaultValueEntry(typeToStore, u));
            return map;
        });
    };
};

const applyEntityDefaultValues = function <T extends Object>(type: Function, object: T, operationDescription: OperationDescription, idResolver: (id?: Id) => Id | null | undefined): T {
    const defaults: Map<string, DefaultValueEntry<T>> = Reflect.getMetadata("wt-entity-defaults", type);
    if (defaults) {
        for (const [key, entry] of defaults.entries()) {
            // set default when it's NOT defined in "entity" (is undefined)
            // and the default value is NOT undefined
            // not need to check if the key of default value does exist in "entity" since user may not specify
            if (_.isUndefined(_.get(object, key)) && !_.isUndefined(entry.value)) {
                const val = entry.value.call(object, operationDescription, idResolver);
                if (!_.isUndefined(val)) {
                    if (_.isArray(val)) {
                        // "_.isArray" MUST be checked before "_.isObject" since an array always be an object
                        _.set(object, key, _.map(val, x => applyEntityDefaultValues(entry.type, x, operationDescription, idResolver)));
                    }
                    else if (_.isObject(val)) {
                        _.set(object, key, applyEntityDefaultValues(entry.type, val, operationDescription, idResolver));
                    }
                    else {
                        _.set(object, key, val);
                    }
                }
            }
        }
    }
    return object;
};

export { defaultValue, applyEntityDefaultValues as applyDefaultValues };