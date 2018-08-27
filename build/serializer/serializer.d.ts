interface Serializer<S> {
    serialize<T>(value: T): S;
    deserialize<T>(buf?: S): T | undefined;
}
export { Serializer };
