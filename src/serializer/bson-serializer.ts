import { Serializer } from "./serializer";
import BSON from "bson";

class BSONSerializer implements Serializer<Buffer> {

    public serialize<T>(value: T): Buffer {
        return (BSON as any).serialize(value);
    }
    
    public deserialize<T>(buf?: Buffer | undefined): T | undefined {
        return buf && (BSON as any).deserialize(buf);
    }

}

export { BSONSerializer };