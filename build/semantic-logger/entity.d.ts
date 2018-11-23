interface Id {
    toString(): string;
}
declare type Operator = {
    id: Id;
    name: string;
};
declare type Timestamp = number;
declare type Pid = number;
export declare enum Level {
    ciritical = 0,
    error = 1,
    warn = 2,
    info = 3,
    verbose = 4
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
export declare type PreDefineEntity<T> = IBaseEntity<T> & IEventEntity;
interface IJSON {
    toJSON(): any;
}
declare class TEntry<T> implements IJSON {
    private _data;
    constructor(data?: T);
    withField(key: keyof T, value: any): TEntry<T>;
    withFields(fields: {}): TEntry<T>;
    toJSON(): any;
}
export { TEntry };
