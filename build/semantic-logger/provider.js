"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const entity_1 = require("./entity");
/**
 * Logger
 * @template TMsg
 */
class Provider {
    constructor(channel, ctrl) {
        this.metaEntity = new entity_1.TEntry();
        this.enabled = true;
        this.channel = channel;
        this.ctrl = ctrl;
    }
    /**
     * Get provider current entity
     * @public
     */
    getEntity() {
        return this.metaEntity;
    }
    /**
     * Registers provider
     * @param ctrl
     * @returns {Provider}
     */
    register(ctrl) {
        this.ctrl = ctrl;
        this.ctrl.addProvider(this.channel, this);
        return this;
    }
    /**
     * unregister provider
     * @returns true if unregister
     */
    unregister() {
        if (!this.ctrl) {
            throw new Error("has no register to the controller");
        }
        return this.ctrl.removeProvider(this.channel);
    }
    /**
     * Determines whether enable is
     * @returns true if enable
     */
    isEnable() {
        return this.enabled;
    }
    /**
     * disable provider
     * @returns disable
     */
    disable() {
        this.enabled = false;
        return this;
    }
    /**
     * Sets provider
     * @param key
     * @param value
     * @returns set
     * @public
     */
    set(key, value) {
        this.metaEntity = this.metaEntity.withField(key, value);
        return this;
    }
    /**
     * Logs provider
     * @template TMsg
     * @param level
     * @param msg
     * @returns log
     * @public
     */
    async log(level, teamId, msg) {
        if (!this.ctrl) {
            throw new Error("No controller register");
        }
        const baseEntity = this.buildBaseEntity(level, teamId, msg);
        const extended = this.metaEntity.toJSON();
        return this.ctrl.log(Object.assign({}, extended, baseEntity));
    }
    /**
     * @param level
     * @param teamId
     * @param msg
     */
    buildBaseEntity(level, teamId, msg) {
        const baseEntity = {
            teamId: teamId,
            hostname: os_1.hostname(),
            pid: process.pid,
            channel: this.channel,
            timestamp: new Date().getTime(),
            level: level,
            msg: msg
        };
        return baseEntity;
    }
}
exports.Provider = Provider;
//# sourceMappingURL=provider.js.map