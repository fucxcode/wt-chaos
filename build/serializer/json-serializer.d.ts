import { Serializer } from "./serializer";
declare class JSONSerializer implements Serializer<string> {
    serialize<T>(value: T): string;
    deserialize<T>(buf?: string | undefined): T | undefined;
}
export { JSONSerializer };
//# sourceMappingURL=json-serializer.d.ts.map