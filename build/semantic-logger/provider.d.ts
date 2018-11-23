import { IBaseEntity, Level, TEntry } from "./entity";
import { Controller } from "./controller";
/**
 * Logger
 * @template TMsg
 */
declare class Provider<TExtends> {
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
     * Unregisters provider
     * @returns true if unregister
     */
    unregister(): boolean;
    /**
     * Determines whether enable is
     * @returns true if enable
     */
    isEnable(): boolean;
    /**
     * Disabeles provider
     * @returns disabele
     */
    disabele(): Provider<TExtends>;
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
    log<TMsg>(level: Level, msg: TMsg): Promise<any>;
    /**
     * Builds base entity
     * @template TMsg
     * @param level
     * @param msg
     * @returns base entity
     * @protected
     */
    protected buildBaseEntity<TMsg>(level: Level, msg: TMsg): IBaseEntity<TMsg>;
}
export { Provider };
