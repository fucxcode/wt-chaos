import { UID, Timestamp } from "../constants";
import { Level } from "./level";
import Reflect from "reflect-metadata";

type Operator = { id: UID };
type Pid = number;
type TeamId = string;

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

///////////////////////////////////////////////////////////////////////////////
function defineProps(obj: object, key: string | symbol | number, value: any) {
    Object.defineProperty(obj, key, {
        value,
        configurable: true,
        enumerable: true
    });
}

interface ToJSON<T> {
    toJSON(): T;
}

type ValueOf<T> = T[keyof T];

class TEntry<T extends object> implements ToJSON<T> {
    private _data: T;

    constructor(data?: T) {
        this._data = data || <T>{};
    }

    public withField(key: keyof T, value: ValueOf<T>): TEntry<T> {
        const obj = Object.create(null);
        defineProps(obj, key, value);
        return this.withFields(obj);
    }

    public withFields(fields: object): TEntry<T> {
        const data = Object.assign({}, this._data, fields);
        return new TEntry<T>(data);
    }

    public toJSON(): T {
        return this._data as T;
    }
}

export { TEntry };
