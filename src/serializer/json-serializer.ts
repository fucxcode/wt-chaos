import { Serializer } from "./serializer";

class JSONSerializer implements Serializer<string> {

    public serialize<T>(value: T): string {
        return JSON.stringify(value);
    }

    public deserialize<T>(buf?: string | undefined): T | undefined {
        return buf && JSON.parse(buf);
    }

}

export { JSONSerializer };