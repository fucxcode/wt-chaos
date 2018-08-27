import { IActivationHandler } from "./i-activation-handler";
import { ICache } from "../../cache/i-cache";
declare class ActivityTracingActivationHandler implements IActivationHandler {
    private _cache;
    private _collection;
    private _ready;
    private _block;
    constructor(cache: ICache, options: {
        db: {
            server: string;
            database: string;
            collection: string;
        };
        block: boolean;
    });
    private traceImpl;
    private trace;
    handle<T extends object>(instance: T): T;
}
export { ActivityTracingActivationHandler };
