import { RouterContext } from "../router-context";
import { OperationContext } from "../operation-context";
import * as _ from "../../utilities";
import { RouterRequest } from "./router-request";
import { Validator, ValidateEntry } from "./validate-properties";
import { WTCode, WTError } from "../..";
import { Stringable, Lengthable } from "../../utilities";

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

export const required = function <T extends OperationContext, TRequest extends RouterRequest<T>, TValue>(message?: string, code?: number) {
    return validate<T, TRequest, TValue>(async (value, key) => {
        if (_.isEmpty(value)) {
            throw new WTError(code || WTCode.invalidInput, message || `property ${key} is required`, undefined, value);
        }
        else {
            return true;
        }
    });
};

const _between = function (value: number, min: number, max: number): boolean {
    return _.isNumber(value) && value >= min && value <= max;
};

export const length = function <T extends OperationContext, TRequest extends RouterRequest<T>, TValue extends Lengthable>(min: number = -Infinity, max: number = Infinity, message?: string, code?: number) {
    return validate<T, TRequest, TValue>(async (value, key) => {
        if (_.isNil(value)) {
            throw new WTError(code || WTCode.invalidInput, message || `the length of property ${key} value must between ${min} - ${max}`, undefined, value);
        }
        else {
            if (_between(value.length, min, max)) {
                return true;
            }
            else {
                throw new WTError(code || WTCode.invalidInput, message || `the length of property ${key} value must between ${min} - ${max}`, undefined, value);
            }
        }
    });
};

export const between = function <T extends OperationContext, TRequest extends RouterRequest<T>>(min: number = -Infinity, max: number = Infinity, message?: string, code?: number) {
    return validate<T, TRequest, number>(async (value, key) => {
        if (_between(value, min, max)) {
            return true;
        }
        else {
            throw new WTError(code || WTCode.invalidInput, message || `the value of property ${key} must between ${min} - ${max}`, undefined, value);
        }
    });
};

export const equals = function <T extends OperationContext, TRequest extends RouterRequest<T>, TValue>(other: (req: TRequest, ctx: RouterContext<T>) => TValue, equality: (x: TValue, y: TValue) => boolean = _.isEqual, message?: string, code?: number) {
    return validate<T, TRequest, TValue>(async (value, key, request, ctx) => {
        const target = other.call(request, request, ctx);
        if (equality(value, target)) {
            return true;
        }
        else {
            throw new WTError(code || WTCode.invalidInput, message || `the value of property ${key} must be equals to ${target}`, target, value);
        }
    });
};

export const regex = function <T extends OperationContext, TRequest extends RouterRequest<T>>(regex: RegExp, message?: string, code?: number) {
    return validate<T, TRequest, string>(async (value, key) => {
        if (regex.test(value)) {
            return true;
        }
        else {
            throw new WTError(code || WTCode.invalidInput, message || `the value of property ${key} failed with regex test`, regex.source, value);
        }
    });
};