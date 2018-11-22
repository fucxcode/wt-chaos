import { IBaseEntity, Level, ISource } from "./entity";
import { Provider } from "./logger";
import { IReporter, ConsoleReport, QueryOptions } from "./report";
import { Entity } from "../../repository/entities";

export type OutPut<T> = ISource & IBaseEntity<T> & Entity;

/**
 * Icontroller
 */
export interface IController {
    /**
     * @param name
     * @returns Provider
     */
    getLogger(name: string): Provider;

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
    addProvider(name: string, provider: Provider): Controller;

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

// Controller
class Controller implements IController {
    // singleton
    private static _single: Controller | null;

    /**
     * Creates controller singleton
     * @param name
     * @param level
     * @returns {Controller}
     */
    public static create(name: string, level: Level, reporters?: IReporter[]): Controller {
        if (!this._single) {
            this._single = new Controller(name, level, reporters);
        }
        return this._single;
    }

    public readonly name: string;
    public readonly level: Level;

    public reporters: IReporter[];
    public providers: Map<string, Provider> = new Map<string, Provider>();

    constructor(name: string, level: Level, reporters?: IReporter[]) {
        this.name = name;
        this.level = level;

        this.reporters = reporters || [];
        if (this.reporters.length === 0) {
            this.reporters.push(new ConsoleReport({ pretty: true, indent: 4 }));
        }
    }

    /**
     * Gets logger
     * @param {String} channel
     * @returns {Provider}
     */
    getLogger(channel: string): Provider {
        let provider = this.getProvider(channel);
        if (!provider) {
            provider = new Provider(channel);
        }
        provider.register(this);
        return provider;
    }

    /**
     * Add provider
     * @param name
     * @param provider
     * @returns {this}
     */
    addProvider(name: string, provider: Provider): Controller {
        this.providers.set(name, provider);
        return this;
    }

    /**
     * Removes provider
     * @param {String} name
     * @returns {this}
     */
    public removeProvider(name: string): boolean {
        return this.providers.delete(name);
    }

    /**
     * Determines whether provider has
     * @param {String} name
     * @returns true if has provider
     */
    public hasProvider(name: string): boolean {
        return this.providers.has(name);
    }

    /**
     * Get provider
     * @param name
     * @returns provider
     */
    public getProvider(name: string): Provider | undefined {
        return this.providers.get(name);
    }

    protected async _log<TMsgtype>(entity: OutPut<TMsgtype>): Promise<OutPut<TMsgtype>[]> {
        // return Promise.resolve(entity);
        const promiseAll: Promise<any>[] = [];
        for (const idx of this.reporters) {
            promiseAll.push(idx.report(entity));
        }
        return Promise.all(promiseAll);
    }

    /**
     * Logs controller
     * @template TMsgtype
     * @param entity
     * @returns {Promise}
     */
    public async log<TMsgtype>(entity: IBaseEntity<TMsgtype>): Promise<OutPut<TMsgtype>[]> {
        const outPut: OutPut<TMsgtype> = Object.assign({}, { source_name: this.name }, entity);

        const provider = this.providers.get(entity.channel);

        if (!this.isLevelEnable(entity.level) || !provider || !provider.isEnable()) {
            return Promise.resolve([outPut]);
        }

        return this._log<TMsgtype>(outPut);
    }

    /**
     * Determines whether provider enable is
     * @template TMsgtype
     * @param entity
     * @returns true if provider enable
     */
    public isProviderEnable<TMsgtype>(entity: IBaseEntity<TMsgtype>): boolean {
        const provider = this.getProvider(entity.channel);
        if (!provider) {
            return false;
        }
        return provider.isEnable();
    }

    /**
     * Determines whether level enable is
     * @param level
     * @returns
     */
    public isLevelEnable(level: Level) {
        return this.level >= level;
    }

    /**
     * TODO: support query options
     * Querys log from drvier
     * @param opts
     * @returns query
     */
    public query(opts: QueryOptions): Promise<any> {
        return Promise.resolve(opts);
    }
}

export { Controller };
