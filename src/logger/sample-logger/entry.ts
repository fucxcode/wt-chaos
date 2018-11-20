function defineProps(obj: object, key: string | symbol | number, value: any) {
    Object.defineProperty(obj, key, {
        value,
        configurable: true,
        enumerable: true
    });
}

export interface IJSON {
    toJSON(): object;
}

/**
 * @description TEntry entry base class
 */
class TEntry<T extends Partial<T>> implements IJSON {
    private _data: T | null;

    constructor(d?: T) {
        this._data = d || <T>Object.create(null);
    }

    public withField(key: keyof T, value: any): TEntry<T> {
        const obj = Object.create(null);
        defineProps(obj, key, value);
        return this.withFields(obj);
    }

    public withFields(fields: {}): TEntry<T> {
        const data = Object.assign({}, this._data, fields);
        return new TEntry<T>(data);
    }

    public toJSON(): object {
        return this._data as object;
    }
}

export { TEntry };
