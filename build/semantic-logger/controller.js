"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("./provider");
const reporter_1 = require("./reporter");
// Controller
class ProviderController {
    constructor(name, level, reporters) {
        this.providers = new Map();
        this.name = name;
        this.level = level;
        this.reporters = reporters || [];
        if (this.reporters.length === 0) {
            this.reporters.push(new reporter_1.ConsoleReport({}));
        }
    }
    /**
     * Creates controller singleton
     * @param name
     * @param level
     * @returns {Controller}
     */
    static create(name, level, reporters) {
        if (!this._single) {
            this._single = new ProviderController(name, level, reporters);
        }
        return this._single;
    }
    /**
     * Gets logger
     * @param {String} channel
     * @returns {Provider}
     */
    getLogger(channel) {
        let provider = this.getProvider(channel);
        if (!provider) {
            provider = new provider_1.Provider(channel);
        }
        provider.register(this);
        return provider;
    }
    /**
     * @description disable the provider by name
     * @param {String} name
     * @return {Controller}
     */
    disableProvider(name) {
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
    addProvider(name, provider) {
        this.providers.set(name, provider);
        return this;
    }
    /**
     * @description Removes provider
     * @param {String} name
     * @returns {this}
     */
    removeProvider(name) {
        return this.providers.delete(name);
    }
    /**
     * @description Determines whether provider has
     * @param {String} name
     * @returns {Boolean} true if has provider
     */
    hasProvider(name) {
        return this.providers.has(name);
    }
    /**
     * @description Get provider
     * @param {String} name
     * @returns {Provider} provider
     */
    getProvider(name) {
        return this.providers.get(name);
    }
    /**
     * @param entity
     * @private
     */
    async _log(entity) {
        // return Promise.resolve(entity);
        const promiseAll = [];
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
    async log(entity) {
        const outPut = Object.assign({}, { sourceName: this.name }, entity);
        const provider = this.providers.get(entity.channel);
        if (!this.isLevelEnable(entity.level) || !provider || !provider.isEnable()) {
            return Promise.resolve([outPut]);
        }
        return this._log(outPut);
    }
    /**
     * Determines whether provider enable is
     * @template TMsgtype
     * @param entity
     * @returns true if provider enable
     */
    isProviderEnable(entity) {
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
    isLevelEnable(level) {
        return this.level >= level;
    }
    /**
     * TODO: support query options
     * Query log from driver
     * @param opts
     * @returns query
     */
    query(opts) {
        return Promise.resolve(opts);
    }
}
exports.ProviderController = ProviderController;
//# sourceMappingURL=controller.js.map