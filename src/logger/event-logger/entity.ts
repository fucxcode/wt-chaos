interface Id {
    toString(): string;
}
type Operator = { id: Id; name: string };
type Timestamp = number;
type Pid = number;

export enum Level {
    ciritical,
    error,
    warn,
    info,
    verbose
}

export interface ISource {
    source_name: string;
}

export interface IBaseEntity<T> {
    hostname: string;
    pid: Pid;
    channel: string;
    level: Level;
    timestamp: Timestamp;
    msg: T;
}

interface IEventEntity {
    operator: Operator;
    keyword: string;
    event: number;
    task: string;
    opcode: number;
}

export type PreDefineEntity<T> = IBaseEntity<T> & IEventEntity;

///////////////////////////////////////////////////////////////////////////////
function defineProps(obj: object, key: string | symbol | number, value: any) {
    Object.defineProperty(obj, key, {
        value,
        configurable: true,
        enumerable: true
    });
}

interface IJSON {
    toJSON(): any;
}

class TEntry<T> implements IJSON {
    private _data: T | null;

    constructor(data?: T) {
        this._data = data || <T>Object.create(null);
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

    public toJSON(): any {
        return this._data;
    }
}

export { TEntry };
