import { UID, Timestamp } from "../constants";
import { Level } from "./level";
declare type Operator = {
    id: UID;
};
declare type Pid = number;
declare type TeamId = string;
export interface Source {
    sourceName: string;
}
export interface BaseEntity<T> {
    teamId: TeamId;
    hostname: string;
    pid: Pid;
    channel: string;
    level: Level;
    timestamp: Timestamp;
    msg: T;
}
export interface MetaEntity {
    operator: Operator;
    keyword?: string;
    opcode?: string;
    task?: string;
    event?: number;
}
interface ToJSON<T> {
    toJSON(): T;
}
declare class TEntry<T> implements ToJSON<T> {
    private _data;
    constructor(data?: T);
    withField(key: keyof T, value: any): TEntry<T>;
    withFields(fields: {}): TEntry<T>;
    toJSON(): T;
}
export { TEntry };
