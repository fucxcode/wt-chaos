import { Container, Type, PropertyType } from "../container";
import { ContainerPool } from "../container-pool";

const inject = function (container?: Container, throwErrorUnregister: boolean = true, type?: Type, lazy: boolean = false): (...args: any[]) => any {
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
    return function (...args: any[]): any {
        if (args.length < 3 || typeof args[2] === `undefined`) {
            // mark properties and members which will be injected in `Resolver.resolveInternal`
            const target: Function = args[0];
            const key: string = args[1];
            const propertyType = type || Reflect.getMetadata(`design:type`, target, key);
            if (lazy) {
                Object.defineProperty(target, key, {
                    configurable: true,
                    enumerable: true,
                    get: () => {
                        if (Reflect.hasMetadata(`wt-lazy-inject-value`, target, key)) {
                            return Reflect.getMetadata(`wt-lazy-inject-value`, target, key);
                        }
                        else {
                            return realContainer.resolve(propertyType);
                        }
                    },
                    set: (value: any) => {
                        Reflect.defineMetadata(`wt-lazy-inject-value`, value, target, key);
                    }
                });
            }
            else {
                // since this metadata will be retrieved in class decorator @injectable and it can only contact the `target.constructor`
                // so in this case we should save metadata in `target.constructor` rather than `target`
                const injectedProperties: PropertyType[] = Reflect.getMetadata(`wt-injected-props`, target.constructor) || [];
                injectedProperties.push(new PropertyType(key, propertyType, realContainer));
                Reflect.defineMetadata(`wt-injected-props`, injectedProperties, target.constructor);
            }
        }
        else if (args.length === 3 && typeof args[2] === `number`) {
            // mark parameters in constructor which will be injected in `Resolver.resolveInternal`
            const target: Function = args[0];
            const methodName: string | symbol = args[1];
            const parameterIndex: number = args[2];
            if (!methodName) {
                const injectedParamIndexes: {
                    index: number,
                    container: Container,
                    type?: Type
                }[] = Reflect.getMetadata(`wt:injected-params-indexes`, target) || [];
                injectedParamIndexes.push({
                    index: parameterIndex,
                    container: realContainer,
                    type: type
                });
                Reflect.defineMetadata(`wt:injected-params-indexes`, injectedParamIndexes, target);
            }
        }
        else {
            throw new Error("invalid @inject decorator declaration");
        }
    };
};

export { inject };