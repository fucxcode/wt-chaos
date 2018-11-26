import { BaseEntity, Source } from "./entity";
import { Level } from "./level";
import { Provider } from "./provider";
import { Reporter, ConsoleReport, QueryOptions } from "./reporter";
import { Entity } from "../repository/entities";

export type OutPut<T> = Source & BaseEntity<T> & Entity;

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

// Controller
class ProviderController implements Controller {
    // singleton
    private static _single: Controller | null;

    /**
     * Creates controller singleton
     * @param name
     * @param level
     * @returns {Controller}
     */
    public static create(name: string, level: Level, reporters?: Reporter[]): Controller {
        if (!this._single) {
            this._single = new ProviderController(name, level, reporters);
        }
        return this._single;
    }

    public readonly name: string;
    public readonly level: Level;

    public reporters: Reporter[];
    public providers: Map<string, Provider<any>> = new Map<string, Provider<any>>();

    constructor(name: string, level: Level, reporters?: Reporter[]) {
        this.name = name;
        this.level = level;

        this.reporters = reporters || [];
        if (this.reporters.length === 0) {
            this.reporters.push(new ConsoleReport({}));
        }
    }

    /**
     * Gets logger
     * @param {String} channel
     * @returns {Provider}
     */
    getLogger(channel: string): Provider<any> {
        let provider = this.getProvider(channel);
        if (!provider) {
            provider = new Provider(channel);
        }
        provider.register(this);
        return provider;
    }

    /**
     * @description disable the provider by name
     * @param {String} name
     * @return {Controller}
     */
    public disableProvider(name: string): Controller {
        const provider = this.providers.get(name);
        if (!provider) {
            return this;
        }
        provider.disable();
        return this;
    }

    /**
     * @description Add provider
     * @param {String} name
     * @param {Provider} provider
     * @returns {this}
     */
    public addProvider(name: string, provider: Provider<any>): Controller {
        this.providers.set(name, provider);
        return this;
    }

    /**
     * @description Removes provider
     * @param {String} name
     * @returns {this}
     */
    public removeProvider(name: string): boolean {
        return this.providers.delete(name);
    }

    /**
     * @description Determines whether provider has
     * @param {String} name
     * @returns {Boolean} true if has provider
     */
    public hasProvider(name: string): boolean {
        return this.providers.has(name);
    }

    /**
     * @description Get provider
     * @param {String} name
     * @returns {Provider} provider
     */
    public getProvider(name: string): Provider<any> | undefined {
        return this.providers.get(name);
    }

    /**
     * @param entity
     * @private
     */
    protected async _log<TMsgtype>(entity: OutPut<TMsgtype>): Promise<OutPut<TMsgtype>[]> {
        // return Promise.resolve(entity);
        const promiseAll: Promise<any>[] = [];
        for (const idx of this.reporters) {
            promiseAll.push(idx.report(entity));
        }
        return Promise.all(promiseAll);
    }

    /**
     * @description Logs controller
     * @template <TMsgtype>
     * @param entity
     * @returns {Promise}
     */
    public async log<TMsgtype>(entity: BaseEntity<TMsgtype>): Promise<OutPut<TMsgtype>[]> {
        const outPut: OutPut<TMsgtype> = Object.assign({}, { sourceName: this.name }, entity);

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
    public isProviderEnable<TMsgtype>(entity: BaseEntity<TMsgtype>): boolean {
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
     * Query log from driver
     * @param opts
     * @returns query
     */
    public query(opts: QueryOptions): Promise<any> {
        return Promise.resolve(opts);
    }
}

export { ProviderController };
