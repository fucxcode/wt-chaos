import util from "util";
import os from "os";
import { Level } from "./level";
import { QueryOptions } from "./query";
import { TEntry } from "./entry";
import { Driver, Session, MongoDBSession } from "../../repository/drivers";
import { MongoDBDriver } from "../../repository/drivers";
import { Id, Entity } from "../../repository/entities";
import { InsertOneOptions } from "../../repository/drivers/insert-one-options";
import { v4 as uuid } from "node-uuid";

/**
 * ConsoleSession
 */
class ConsoleSession implements Session {
    public get id(): any {
        return uuid();
    }

    public inTransaction(): boolean {
        return false;
    }
}

/**
 * OutputDriver
 */
export interface OutputDriver<TSession extends Session> {
    /**
     * @param collectionName
     * @param entity
     * @param options
     */
    insertOne<T extends TEntry<T>>(
        collectionName: string,
        entry: T,
        options?: InsertOneOptions<TSession>
    ): Promise<Partial<T>>;

    /**
     * @param qyery
     */
    find(qyery: QueryOptions): Promise<any>;
}

/**
 * @class ConsoleDriver
 */
class ConsoleDriver implements OutputDriver<ConsoleSession> {
    public async insertOne<T>(
        collectionName: string,
        entry: TEntry<T>,
        options?: InsertOneOptions<ConsoleSession>
    ): Promise<Partial<T>> {
        try {
            console.log(JSON.stringify(entry.toJSON()));
        } catch (_) {
            console.log(entry.toJSON());
        } finally {
            return Promise.resolve({});
        }
    }

    public async find<T>(query: QueryOptions): Promise<any> {
        console.warn("console not support query !!!");
        return Promise.resolve();
    }
}

interface BaseEntry extends Entity {
    msg: string;

    hostname: string;

    pid: number;

    level: string;
}

interface ILogger {
    /**
     * @param level
     * @param msg
     * @param args
     * @returns log
     */
    log(level: Level, msg: string, ...args: any[]): Promise<any>;

    /**
     * @param query
     * @returns query
     */
    query(query: QueryOptions): Promise<any>;

    /**
     * @param level
     * @returns true if level enabled
     */
    isLevelEnabled(level: Level): boolean;
}

/**
 * @class Provider
 */
export class Provider<T extends BaseEntry, TSession extends Session> implements ILogger {
    private _entry: TEntry<T>;
    public get entry() {
        return this._entry;
    }

    public set entry(entry: TEntry<T>) {
        this._entry = entry;
    }

    private _driver: OutputDriver<TSession>;
    public set driver(d: OutputDriver<TSession>) {
        this._driver = d;
    }
    public get driver() {
        return this._driver;
    }

    constructor(public channel: string, public level?: Level, driver?: OutputDriver<TSession>) {
        this.level = level || Level.info;
        this._driver = driver || new ConsoleDriver();
        this._entry = new TEntry<T>();
        this._entry = this._entry.withFields({
            hostnmae: os.hostname(),
            pid: process.pid,
            channel: this.channel,
            level: this.level
        });
    }

    add(key: keyof T, value: any) {
        this.entry = this.entry.withField(key, value);
        return this;
    }

    public isLevelEnabled(level: Level): boolean {
        return (this.level as Level) >= level;
    }

    public async log(level: Level, msg: string, ...args: any[]): Promise<any> {
        if (!this.isLevelEnabled(level)) {
            return Promise.resolve();
        }

        msg = util.format(msg, ...args);
        this.entry = this.entry.withField("msg", msg).withField("level", level);
        return this._driver.insertOne("", this.entry as any);
    }

    public async query(query: QueryOptions): Promise<any> {
        return this.driver.find(query);
    }
}
