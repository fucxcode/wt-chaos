import * as _ from "../../utilities";

class DefaultValueEntry {

    constructor(
        public type: Function,
        public value: any
    ) {}

}

const defaultValue = function <T>(value: () => T, arrayGenericType?: Function) {
    return function (target: any, propertyKey: string): any {
        const typeToStore: Function = arrayGenericType || Reflect.getMetadata("design:type", target, propertyKey);
        _.updateMetadata<Map<string, DefaultValueEntry>, T>("wt-entity-defaults", value(), target.constructor, () => new Map<string, DefaultValueEntry>(), (v, u) => {
            const map = new Map<string, DefaultValueEntry>(v);
            map.set(propertyKey, new DefaultValueEntry(typeToStore, u));
            return map;
        });
    };
};

const applyDefaultValues = function <T extends Object>(type: Function, object: T): T {
    const defaults: Map<string, DefaultValueEntry> = Reflect.getMetadata("wt-entity-defaults", type);
    if (defaults) {
        for (const [key, entry] of defaults.entries()) {
            // set default when it's NOT defined in "entity" (is undefined)
            // and the default value is NOT undefined
            // not need to check if the key of default value does exist in "entity" since user may not specify
            if (_.isUndefined(_.get(object, key)) && !_.isUndefined(entry.value)) {
                if (_.isArray(entry.value)) {
                    // "_.isArray" MUST be checked before "_.isObject" since an array always be an object
                    _.set(object, key, _.map(entry.value, x => applyDefaultValues(entry.type, x)));
                }
                else if (_.isObject(entry.value)) {
                    _.set(object, key, applyDefaultValues(entry.type, entry.value));
                }
                else {
                    _.set(object, key, entry.value);
                }
            }
        }
    }
    return object;
};

export { defaultValue, applyDefaultValues };