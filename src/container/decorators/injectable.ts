import { IContainer, Lifecycles, Type, ParamType } from "../i-container";
import { getDefaultContainer } from "../container";

const injectable = function (container?: IContainer, lifecycle: Lifecycles = Lifecycles.singleton, type?: Type) {
    let realContainer: IContainer;
    if (container) {
        realContainer = container;
    }
    else {
        const defaultContainer = getDefaultContainer();
        if (defaultContainer) {
            realContainer = defaultContainer;
        }
        else {
            throw new Error("You must specify 'container' or has 'defaultContainer' registered.");
        }
    }
    return function (target: any) {
        const paramTypes: ParamType[] = [];
        const designParamTypes: any[] = Reflect.getMetadata(`design:paramtypes`, target);
        const injectedParamIndexes: {
            index: number,
            container: IContainer,
            type?: Type
        }[] = Reflect.getMetadata(`wt:injected-params-indexes`, target) || [];
        for (const injectedParamIndex of injectedParamIndexes) {
            paramTypes[injectedParamIndex.index] = new ParamType(injectedParamIndex.type || designParamTypes[injectedParamIndex.index], injectedParamIndex.container);
        }

        const propTypes = Reflect.getMetadata(`wt-injected-props`, target) || [];
        realContainer.registerType(type || target, target, lifecycle, paramTypes, propTypes);
        return target;
    };
};

export { injectable };