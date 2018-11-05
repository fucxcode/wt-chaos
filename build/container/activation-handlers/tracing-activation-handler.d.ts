import { IActivationHandler } from "./i-activation-handler";
import { Cache } from "../../cache";
import { Id, Session, Driver } from "../../repository";
declare class ActivityTracingActivationHandler<TSession extends Session, TID extends Id, TDriver extends Driver<TSession, TID>> implements IActivationHandler {
    private _cache;
    private _driver;
    private _collectionName;
    private _throwException;
    constructor(cache: Cache, driver: TDriver, collectionName?: string, throwException?: boolean);
    private traceImpl;
    private trace;
    handle<T extends object>(instance: T): T;
}
export { ActivityTracingActivationHandler };
