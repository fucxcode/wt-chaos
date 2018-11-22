import { IBaseEntity, Level, TEntry } from "./entity";
import { hostname } from "os";
import { Controller } from "./controller";

/**
 * Logger
 * @template TMsg
 */
class Provider {
    protected _metaEntity: TEntry<any> = new TEntry();

    public enabled: boolean = true;
    public readonly channel: string;

    public ctrl: Controller | undefined;

    constructor(channel: string, ctrl?: Controller) {
        this.channel = channel;
        this.ctrl = ctrl;
    }

    /**
     * Registers provider
     * @param ctrl
     * @returns {This}
     */
    public register(ctrl: Controller) {
        this.ctrl = ctrl;
        this.ctrl.addProvider(this.channel, this);
        return this;
    }

    /**
     * Unregisters provider
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
     * Disabeles provider
     * @returns disabele
     */
    public disabele(): Provider {
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
    public set(key: any, value: any): Provider {
        this._metaEntity = this._metaEntity.withField(key, value);
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
    public async log<TMsg>(level: Level, msg: TMsg): Promise<any> {
        if (!this.ctrl) {
            console.error("no controller set");
            throw new Error("No controller register");
        }

        const baseEntity: IBaseEntity<TMsg> = this.buildBaseEntity(level, msg);

        const extended = this._metaEntity.toJSON();

        return this.ctrl.log(Object.assign({}, extended, baseEntity));
    }

    /**
     * Builds base entity
     * @template TMsg
     * @param level
     * @param msg
     * @returns base entity
     * @protected
     */
    protected buildBaseEntity<TMsg>(level: Level, msg: TMsg): IBaseEntity<TMsg> {
        const baseEntity: IBaseEntity<TMsg> = {
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
