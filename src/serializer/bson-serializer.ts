import { Serializer } from "./serializer";
import { BSON } from "bson";

class BSONSerializer implements Serializer<Buffer> {

    private _bson: BSON;

    constructor() {
        this._bson = new BSON();
    }

    public serialize<T>(value: T): Buffer {
        return this._bson.serialize(value);
    }
    
    public deserialize<T>(buf?: Buffer | undefined): T | undefined {
        return buf && this._bson.deserialize(buf);
    }

}

export { BSONSerializer };