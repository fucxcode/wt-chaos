"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i_container_1 = require("../i-container");
const container_1 = require("../container");
const injectable = function (container, lifecycle = i_container_1.Lifecycles.singleton, type) {
    let realContainer;
    if (container) {
        realContainer = container;
    }
    else {
        const defaultContainer = container_1.getDefaultContainer();
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
            paramTypes[injectedParamIndex.index] = new i_container_1.ParamType(injectedParamIndex.type || designParamTypes[injectedParamIndex.index], injectedParamIndex.container);
        }
        const propTypes = Reflect.getMetadata(`wt-injected-props`, target) || [];
        realContainer.registerType(type || target, target, lifecycle, paramTypes, propTypes);
        return target;
    };
};
exports.injectable = injectable;
//# sourceMappingURL=injectable.js.map