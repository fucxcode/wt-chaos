import { OperationContext } from "../operation-context";
import { RouterRequest } from "./router-request";
import { RouterContext } from "../router-context";
import * as _ from "../../utilities";
import { WTError } from "../..";
import { WTCode } from "../../errors";

export type Validator<T extends OperationContext, TRequest extends RouterRequest<T>, TValue> = (value: TValue, propertyKey: string, request: TRequest, ctx: RouterContext<T>) => Promise<boolean>;

export class ValidateEntry<T extends OperationContext, TRequest extends RouterRequest<T>, TValue> {

    private _validator: Validator<T, TRequest, TValue>;
    public get validator(): Validator<T, TRequest, TValue> {
        return this._validator;
    }

    private _message: string;
    public get message(): string {
        return this._message;
    }

    private _code: number;
    public get code(): number {
        return this._code;
    }

    constructor(validator: Validator<T, TRequest, TValue>, message: string = "", code: number = WTCode.invalidInput) {
        this._validator = validator;
        this._message = message;
        this._code = code;
    }

}

export const validateRouterRequest = async function <T extends OperationContext, TRequest extends RouterRequest<T>>(request: TRequest, ctx: RouterContext<T>): Promise<void> {
    const map = Reflect.getMetadata(`wt-router-req-validators`, request) as Map<string, ValidateEntry<T, TRequest, any>[]>;
    if (map && map.size > 0) {
        for (const [key, entries] of map) {
            const value = _.get(request, key);
            for (const entry of entries) {
                if (!(await entry.validator.call(request, value, key, request, ctx))) {
                    throw new WTError(
                        entry.code,
                        _.isNilOrWriteSpaces(entry.message) ? `validation failed on property ${key}` : entry.message,
                        undefined,
                        value);
                }
            }
        }
    }
};