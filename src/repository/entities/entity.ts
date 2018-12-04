import { Id } from "./id";
import { defaultValue } from "../decorators";

export abstract class Entity {

    @defaultValue((operationDescription, idResolver) => idResolver())
    _id?: Id;

}