const collectionName = function (collectionName: string) {
    return function (target: any) {
        Reflect.defineMetadata("wt-entity-col-name", collectionName, target);
        return target;
    };
};

const getCollectionNameFromEntity = function (type: any): string {
    return Reflect.getMetadata("wt-entity-col-name", type);
};

export { collectionName, getCollectionNameFromEntity as getCollectionName };