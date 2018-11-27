import { BaseEntity, Source } from "./entity";
import { Level } from "./level";
import { Provider } from "./provider";
import { Reporter, QueryOptions, Querier } from "./reporter";
import { Entity } from "../repository/entities";
export declare type OutPut<T> = Source & BaseEntity<T> & Entity;
/**
 * Controller
 */
export interface Controller {
    /**
     * @param name
     * @returns Provider
     */
    getLogger(name: string): Provider<any>;
    /**
     * @template T
     * @param entity
     * @returns log
     */
    log<T>(entity: BaseEntity<T>): Promise<any>;
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
declare class ProviderController implements Controller {
    private static _single;
    /**
     * Creates controller singleton
     * @param name
     * @param level
     * @returns {Controller}
     */
    static create(name: string, level: Level, reporters?: Reporter[]): Controller;
    readonly name: string;
    readonly level: Level;
    reporters: Reporter[];
    providers: Map<string, Provider<any>>;
    querier: Querier | null;
    constructor(name: string, level: Level, reporters?: Reporter[]);
    /**
     * Gets logger
     * @param {String} channel
     * @returns {Provider}
     */
    getLogger(channel: string): Provider<any>;
    /**
     * @description disable the provider by name
     * @param {String} name
     * @return {Controller}
     */
    disableProvider(name: string): Controller;
    /**
     * @description Add provider
     * @param {String} name
     * @param {Provider} provider
     * @returns {this}
     */
    addProvider(name: string, provider: Provider<any>): Controller;
    /**
     * @description Removes provider
     * @param {String} name
     * @returns {this}
     */
    removeProvider(name: string): boolean;
    /**
     * @description Determines whether provider has
     * @param {String} name
     * @returns {Boolean} true if has provider
     */
    hasProvider(name: string): boolean;
    /**
     * @description Get provider
     * @param {String} name
     * @returns {Provider} provider
     */
    getProvider(name: string): Provider<any> | undefined;
    /**
     * @param entity
     * @private
     */
    protected _log<TMsgtype>(entity: OutPut<TMsgtype>): Promise<OutPut<TMsgtype>[]>;
    /**
     * @description Logs controller
     * @template <TMsgtype>
     * @param entity
     * @returns {Promise}
     */
    log<TMsgtype>(entity: BaseEntity<TMsgtype>): Promise<OutPut<TMsgtype>[]>;
    /**
     * Determines whether provider enable is
     * @template TMsgtype
     * @param entity
     * @returns true if provider enable
     */
    isProviderEnable<TMsgtype>(entity: BaseEntity<TMsgtype>): boolean;
    /**
     * Determines whether level enable is
     * @param level
     * @returns
     */
    isLevelEnable(level: Level): boolean;
    /**
     * Query log from driver
     * @param opts
     * @returns query
     */
    query(opts: QueryOptions): Promise<any>;
}
export { ProviderController };
