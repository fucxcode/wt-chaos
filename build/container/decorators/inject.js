"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i_container_1 = require("../i-container");
const inject = function (container, throwErrorUnregister = true, type, lazy = false) {
    return function (...args) {
        if (args.length < 3 || typeof args[2] === `undefined`) {
            // mark properties and members which will be injected in `Resolver.resolveInternal`
            const target = args[0];
            const key = args[1];
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
                            return container.resolve(propertyType);
                        }
                    },
                    set: (value) => {
                        Reflect.defineMetadata(`wt-lazy-inject-value`, value, target, key);
                    }
                });
            }
            else {
                // since this metadata will be retrieved in class decorator @injectable and it can only contact the `target.constructor`
                // so in this case we should save metadata in `target.constructor` rather than `target`
                const injectedProperties = Reflect.getMetadata(`wt-injected-props`, target.constructor) || [];
                injectedProperties.push(new i_container_1.PropertyType(key, propertyType, container));
                Reflect.defineMetadata(`wt-injected-props`, injectedProperties, target.constructor);
            }
        }
        else if (args.length === 3 && typeof args[2] === `number`) {
            // mark parameters in constructor which will be injected in `Resolver.resolveInternal`
            const target = args[0];
            const methodName = args[1];
            const parameterIndex = args[2];
            if (!methodName) {
                const injectedParamIndexes = Reflect.getMetadata(`wt:injected-params-indexes`, target) || [];
                injectedParamIndexes.push({
                    index: parameterIndex,
                    container: container,
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
exports.inject = inject;
//# sourceMappingURL=inject.js.map