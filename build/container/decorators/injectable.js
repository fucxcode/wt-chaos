"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../container");
const container_pool_1 = require("../container-pool");
const injectable = function (container, lifecycle = container_1.Lifecycles.singleton, type, postInstantiate) {
    let realContainer;
    if (container) {
        realContainer = container;
    }
    else {
        const defaultContainer = container_pool_1.ContainerPool.getDefaultContainer();
        if (defaultContainer) {
            realContainer = defaultContainer;
        }
        else {
            throw new Error("You must specify 'container' or has 'defaultContainer' registered.");
        }
    }
    return function (target) {
        const paramTypes = [];
        const designParamTypes = Reflect.getMetadata(`design:paramtypes`, target);
        const injectedParamIndexes = Reflect.getMetadata(`wt:injected-params-indexes`, target) || [];
        for (const injectedParamIndex of injectedParamIndexes) {
            paramTypes[injectedParamIndex.index] = new container_1.ParamType(injectedParamIndex.type || designParamTypes[injectedParamIndex.index], injectedParamIndex.container);
        }
        const propTypes = Reflect.getMetadata(`wt-injected-props`, target) || [];
        realContainer.registerType(type || target, target, lifecycle, paramTypes, propTypes, postInstantiate);
        return target;
    };
};
exports.injectable = injectable;
//# sourceMappingURL=injectable.js.map