import { OperationContext } from "../operation-context";
import { RouterRequest } from "./router-request";
import { RouterContext } from "..";

export interface RouterRequestConstructor<T extends OperationContext, TRequest extends RouterRequest<T>> {

    new(): TRequest;

}