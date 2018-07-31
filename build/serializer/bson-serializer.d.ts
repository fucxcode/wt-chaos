/// <reference types="node" />
import { Serializer } from "./serializer";
declare class BSONSerializer implements Serializer<Buffer> {
    private _bson;
    constructor();
    serialize<T>(value: T): Buffer;
    deserialize<T>(buf?: Buffer | undefined): T | undefined;
}
export { BSONSerializer };
//# sourceMappingURL=bson-serializer.d.ts.map