"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../utilities"));
const METADATA_KEY_FACADE_MIDDLEWARES = "wt-facade-middlewares";
const METADATA_KEY_METHOD_MIDDLEWARES = "wt-actions-middlewares";
const setFacadeMiddlewares = function (target, middlewares) {
    _.updateMetadata(METADATA_KEY_FACADE_MIDDLEWARES, middlewares, target, () => new Map(), (v, u) => {
        const currentMap = new Map(v);
        let currentMiddlewares = currentMap.get(target);
        if (!currentMiddlewares) {
            currentMiddlewares = [];
            currentMap.set(target, currentMiddlewares);
        }
        // since the decorator invoke sequence is reversed as their definition sequence
        // (which means @decorator1 @decorator2 @decorator3 will be called as decorator3 decorator2 decorator1)
        // we use `Array.unshift` to ensure the invoke sequence should be the same as definition
        // ref: https://www.typescriptlang.org/docs/handbook/decorators.html, section "Decorator Composition"
        currentMiddlewares.unshift(...u);
        return currentMap;
    });
};
exports.setFacadeMiddlewares = setFacadeMiddlewares;
const getFacadeMiddlewares = function (target) {
    const middlewaresMap = Reflect.getMetadata(METADATA_KEY_FACADE_MIDDLEWARES, target) || new Map();
    const output = [];
    for (const [fn, middlewares] of middlewaresMap) {
        for (const middleware of middlewares) {
            output.push(middleware);
        }
    }
    return output;
};
exports.getFacadeMiddlewares = getFacadeMiddlewares;
const setMethodMiddlewares = function (target, propertyKey, middlewares) {
    _.updateMetadata(METADATA_KEY_METHOD_MIDDLEWARES, middlewares, target, () => new Map(), (v, u) => {
        const currentMap = new Map(v);
        let currentMiddlewares = currentMap.get(propertyKey);
        if (!currentMiddlewares) {
            currentMiddlewares = [];
            currentMap.set(propertyKey, currentMiddlewares);
        }
        // since the decorator invoke sequence is reversed as their definition sequence
        // (which means @decorator1 @decorator2 @decorator3 will be called as decorator3 decorator2 decorator1)
        // we use `Array.unshift` to ensure the invoke sequence should be the same as definition
        // ref: https://www.typescriptlang.org/docs/handbook/decorators.html, section "Decorator Composition"
        currentMiddlewares.unshift(...u);
        return currentMap;
    });
};
exports.setMethodMiddlewares = setMethodMiddlewares;
const getMethodMiddlewares = function (target) {
    return Reflect.getMetadata(METADATA_KEY_METHOD_MIDDLEWARES, target) || new Map();
};
exports.getMethodMiddlewares = getMethodMiddlewares;
const middlewares = function (...middlewares) {
    return function (...args) {
        if (args.length === 1) {
            // class decorator
            setFacadeMiddlewares(args[0], middlewares);
            return args[0];
        }
        else if (args.length === 3 && typeof args[2] !== "number") {
            // method decorator
            setMethodMiddlewares(args[0], args[1], middlewares);
        }
        else {
            throw new Error("middleware decorator only support on class and method");
        }
    };
};
exports.middlewares = middlewares;
//# sourceMappingURL=decorator-middlewares.js.map