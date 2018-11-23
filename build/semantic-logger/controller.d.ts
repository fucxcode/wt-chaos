import { IBaseEntity, Level, ISource } from "./entity";
import { Provider } from "./provider";
import { IReporter, QueryOptions } from "./report";
import { Entity } from "../repository/entities";
export declare type OutPut<T> = ISource & IBaseEntity<T> & Entity;
/**
 * Icontroller
 */
export interface IController {
    /**
     * @param name
     * @returns Provider
     */
    getLogger(name: string): Provider<any>;
    /**
     * @template T
     * @param entriy
     * @returns log
     */
    log<T>(entriy: IBaseEntity<T>): Promise<any>;
    /**
     * @param level
     * @returns true if level enable
     */
    isLevelEnable(level: Level): boolean;
    /**
     * @param opts
     * @returns query
     */
    query(opts: QueryOptions): Promise<any>;
    /**
     * @param name
     * @param provider
     * @returns provider
     */
    addProvider(name: string, provider: Provider<any>): Controller;
    /**
     * @param name
     * @returns true if provider
     */
    hasProvider(name: string): boolean;
    /**
     * @param name
     * @returns true if provider
     */
    removeProvider(name: string): boolean;
}
declare class Controller implements IController {
    private static _single;
    /**
     * Creates controller singleton
     * @param name
     * @param level
     * @returns {Controller}
     */
    static create(name: string, level: Level, reporters?: IReporter[]): Controller;
    readonly name: string;
    readonly level: Level;
    reporters: IReporter[];
    providers: Map<string, Provider<any>>;
    constructor(name: string, level: Level, reporters?: IReporter[]);
    /**
     * Gets logger
     * @param {String} channel
     * @returns {Provider}
     */
    getLogger(channel: string): Provider<any>;
    /**
     * @description disable the provider by name
     * @param name
     * @return {Controller}
     */
    disableProider(name: string): Controller;
    /**
     * Add provider
     * @param name
     * @param provider
     * @returns {this}
     */
    addProvider(name: string, provider: Provider<any>): Controller;
    /**
     * Removes provider
     * @param {String} name
     * @returns {this}
     */
    removeProvider(name: string): boolean;
    /**
     * Determines whether provider has
     * @param {String} name
     * @returns true if has provider
     */
    hasProvider(name: string): boolean;
    /**
     * Get provider
     * @param name
     * @returns provider
     */
    getProvider(name: string): Provider<any> | undefined;
    protected _log<TMsgtype>(entity: OutPut<TMsgtype>): Promise<OutPut<TMsgtype>[]>;
    /**
     * Logs controller
     * @template TMsgtype
     * @param entity
     * @returns {Promise}
     */
    log<TMsgtype>(entity: IBaseEntity<TMsgtype>): Promise<OutPut<TMsgtype>[]>;
    /**
     * Determines whether provider enable is
     * @template TMsgtype
     * @param entity
     * @returns true if provider enable
     */
    isProviderEnable<TMsgtype>(entity: IBaseEntity<TMsgtype>): boolean;
    /**
     * Determines whether level enable is
     * @param level
     * @returns
     */
    isLevelEnable(level: Level): boolean;
    /**
     * TODO: support query options
     * Querys log from drvier
     * @param opts
     * @returns query
     */
    query(opts: QueryOptions): Promise<any>;
}
export { Controller };
