import { Id } from "../../entities/id";
import microtime from "microtime";
import * as _ from "../../../utilities";

class LokiId implements Id {

    private _value: number;

    constructor(id?: number | string) {
        if (id) {
            this._value = Number(id);
        }
        else {
            this._value = microtime.now();
        }
    }

    public toString(): string {
        return this._value.toString();
    }

    public equals(other: LokiId): boolean {
        return this._value === other._value;
    }

}

export { LokiId };