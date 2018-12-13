import { Container, Lifecycles, Type, ParamType, PropertyType } from "../container";
import { ContainerPool } from "../container-pool";
import * as _ from "../../utilities";

const injectable = function (container?: Container, lifecycle: Lifecycles = Lifecycles.singleton, type?: Type, postInstantiate?: (instance: any) => void) {
    let realContainer: Container;
    if (container) {
        realContainer = container;
    }
    else {
        const defaultContainer = ContainerPool.getDefaultContainer();
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
            container: Container,
            type?: Type
        }[] = Reflect.getMetadata(`wt:injected-params-indexes`, target) || [];
        for (const injectedParamIndex of injectedParamIndexes) {
            paramTypes[injectedParamIndex.index] = new ParamType(injectedParamIndex.type || designParamTypes[injectedParamIndex.index], injectedParamIndex.container);
        }

        const props: Map<string, PropertyType> = Reflect.getMetadata(`wt-injected-props`, target) || new Map<string, PropertyType>();
        realContainer.registerType(type || target, target, lifecycle, paramTypes, [...props.values()], postInstantiate);
        return target;
    };
};

export { injectable };