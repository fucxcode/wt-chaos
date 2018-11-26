import { hostname } from "os";
import { BaseEntity, TEntry } from "./entity";
import { Level } from "./level";
import { Controller } from "./controller";

/**
 * Logger
 * @template TMsg
 */
class Provider<TExtends> {
    protected metaEntity: TEntry<TExtends> = new TEntry();

    public enabled: boolean = true;
    public readonly channel: string;

    public ctrl: Controller | undefined;

    constructor(channel: string, ctrl?: Controller) {
        this.channel = channel;
        this.ctrl = ctrl;
    }

    /**
     * Get provider current entity
     * @public
     */
    public getEntity(): TEntry<TExtends> {
        return this.metaEntity;
    }

    /**
     * Registers provider
     * @param ctrl
     * @returns {Provider}
     */
    public register(ctrl: Controller) {
        this.ctrl = ctrl;
        this.ctrl.addProvider(this.channel, this);
        return this;
    }

    /**
     * unregister provider
     * @returns true if unregister
     */
    public unregister(): boolean {
        if (!this.ctrl) {
            throw new Error("has no register to the controller");
        }
        return this.ctrl.removeProvider(this.channel);
    }

    /**
     * Determines whether enable is
     * @returns true if enable
     */
    public isEnable(): boolean {
        return this.enabled;
    }

    /**
     * disable provider
     * @returns disable
     */
    public disable(): Provider<TExtends> {
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
    public set(key: keyof TExtends, value: any): Provider<TExtends> {
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
    public async log<TMsg>(level: Level, teamId: string, msg: TMsg): Promise<any> {
        if (!this.ctrl) {
            throw new Error("No controller register");
        }
        const baseEntity: BaseEntity<TMsg> = this.buildBaseEntity(level, teamId, msg);
        const extended = this.metaEntity.toJSON();

        return this.ctrl.log(Object.assign({}, extended, baseEntity));
    }

    /**
     * @param level
     * @param teamId
     * @param msg
     */
    protected buildBaseEntity<TMsg>(level: Level, teamId: string, msg: TMsg): BaseEntity<TMsg> {
        const baseEntity: BaseEntity<TMsg> = {
            teamId: teamId,
            hostname: hostname(),
            pid: process.pid,
            channel: this.channel,
            timestamp: new Date().getTime(),
            level: level,
            msg: msg
        };
        return baseEntity;
    }
}

export { Provider };
