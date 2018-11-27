import { BaseEntity, TEntry } from "./entity";
import { Level } from "./level";
import { Controller } from "./controller";
/**
 * Logger
 * @template TMsg
 */
declare class Provider<TExtends extends object> {
    protected metaEntity: TEntry<TExtends>;
    enabled: boolean;
    readonly channel: string;
    ctrl: Controller | undefined;
    constructor(channel: string, ctrl?: Controller);
    /**
     * Get provider current entity
     * @public
     */
    getEntity(): TEntry<TExtends>;
    /**
     * Registers provider
     * @param ctrl
     * @returns {Provider}
     */
    register(ctrl: Controller): this;
    /**
     * unregister provider
     * @returns true if unregister
     */
    unregister(): boolean;
    /**
     * Determines whether enable is
     * @returns true if enable
     */
    isEnable(): boolean;
    /**
     * disable provider
     * @returns disable
     */
    disable(): Provider<TExtends>;
    /**
     * Sets provider
     * @param key
     * @param value
     * @returns set
     * @public
     */
    set(key: keyof TExtends, value: any): Provider<TExtends>;
    /**
     * Logs provider
     * @template TMsg
     * @param level
     * @param msg
     * @returns log
     * @public
     */
    log<TMsg extends object>(level: Level, teamId: string, msg: TMsg): Promise<any>;
    /**
     * @param level
     * @param teamId
     * @param msg
     */
    protected buildBaseEntity<TMsg>(level: Level, teamId: string, msg: TMsg): BaseEntity<TMsg>;
}
export { Provider };
