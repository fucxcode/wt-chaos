import { RouterContext } from "../router-context";
import { OperationContext } from "../operation-context";
import * as _ from "../../utilities";
import { RouterRequest } from "./router-request";
import { Validator, ValidateEntry } from "./validate-properties";
import { WTCode } from "../..";

export const validate = function <T extends OperationContext, TRequest extends RouterRequest<T>, TValue>(validator: Validator<T, TRequest, TValue>, message?: string, code?: number) {
    return function (target: any, propertyKey: string) {
        _.updateMetadata<Map<string, ValidateEntry<T, TRequest, any>[]>, Validator<T, TRequest, TValue>>(`wt-router-req-validators`, validator, target, () => new Map<string, ValidateEntry<T, TRequest, any>[]>(), (v, u) => {
            const currentMap = new Map<string, ValidateEntry<T, TRequest, any>[]>(v);
            let currentValidators = currentMap.get(propertyKey);
            if (!currentValidators) {
                currentValidators = [];
                currentMap.set(propertyKey, currentValidators);
            }
            // since the decorator invoke sequence is reversed as their definition sequence
            // (which means @decorator1 @decorator2 @decorator3 will be called as decorator3 decorator2 decorator1)
            // we use `Array.unshift` to ensure the invoke sequence should be the same as definition
            // ref: https://www.typescriptlang.org/docs/handbook/decorators.html, section "Decorator Composition"
            currentValidators.unshift(new ValidateEntry<T, TRequest, TValue>(validator, message, code));
            return currentMap;
        });
    };
};

