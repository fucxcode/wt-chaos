/// <reference types="node" />
/// <reference types="mocha" />
import { is } from "../constants";
declare type ScanOptions = {
    match?: string;
    count?: number;
};
interface Cache {
    ping(): Promise<string>;
    disconnect(): void;
    getBuffer(key: string): Promise<Buffer>;
    pexpire(key: string, milliseconds: number): Promise<is>;
    mgetBuffer(...keys: string[]): Promise<Buffer[]>;
    psetex(key: string, milliseconds: number, value: any): Promise<string>;
    set(key: string, value: any, ...args: any[]): Promise<string>;
    mset(...keyValuePairs: [string, any][]): Promise<string>;
    del(...keys: string[]): Promise<number>;
    scanStream(options?: ScanOptions): NodeJS.EventEmitter;
    scan(options?: ScanOptions): Promise<string[]>;
    clear(): Promise<string>;
    multi(): Pipeline;
    sadd(key: string, ...members: any[]): Promise<number>;
    srem(key: string, ...members: any[]): Promise<number>;
    smembers(key: string): Promise<any[]>;
}
interface Pipeline {
    pexpire(key: string, milliseconds: number): void;
    mset(...keyValuePairs: [string, any][]): void;
    exec(): Promise<any>;
}
export { Cache, Pipeline, ScanOptions };
