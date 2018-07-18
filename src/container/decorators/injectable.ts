import { IContainer, lifecycles, Type, ParamType } from "../i-container";

const injectable = function (container: IContainer, lifecycle: lifecycles = lifecycles.singleton, type?: Type) {
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

        container.registerType(type || target, target, lifecycle, paramTypes, propTypes);
        return target;
    };
};

export { injectable };