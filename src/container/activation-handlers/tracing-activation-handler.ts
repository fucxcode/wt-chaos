import { sep } from "path";
import * as _ from "../../utilities";
import { IActivationHandler } from "./i-activation-handler";
import { TraceOptions } from "./trace-decorator";
import { Cache } from "../../cache";
import { Entity, Id, Session, Driver } from "../../repository";
import { Timestamp, UID } from "../../constants";

interface ActivityTraceEntity extends Entity {

    oid: string;

    timestamp: Timestamp;

    team: Id;

    uid: UID;

    class_name: string;

    method_name: string;

    arguments: any;

}

class ActivityTracingActivationHandler<TSession extends Session, TID extends Id, TDriver extends Driver<TSession, TID>> implements IActivationHandler {

    private _cache: Cache;

    private _driver: TDriver;

    private _collectionName: string;

    private _throwException: boolean;

    constructor(cache: Cache, driver: TDriver, collectionName: string = `activity_traces`, throwException: boolean = false) {
        this._cache = cache;
        this._driver = driver;
        this._collectionName = collectionName;
        this._throwException = throwException;
    }

    private async traceImpl(oid: string, team: Id, uid: UID, className: string, methodName: string, args: any[]): Promise<void> {
        try {
            await this._driver.insertOne<ActivityTraceEntity>(this._collectionName, {
                oid: oid,
                timestamp: Date.now(),
                team: team,
                uid: uid,
                class_name: className,
                method_name: methodName,
                arguments: _.mapKeys(args, (value, key) => key.split(`$`).join(`__$__`).split(`.`).join(`__.__`))
            });
        }
        catch (ex) {
            if (this._throwException) {
                throw ex;
            }
        }
    }

    private async trace(target: any, propertyKey: any, args: any[], options: TraceOptions): Promise<void> {
        if (options.enabled) {
            const oid = options.oidResolver(args) as string;
            const team = this._driver.parseId(options.teamIdResolver(args));
            const uid = options.uidResolver(args) as string;
            const path = options.pathResolver(args);
            if (!_.isEmpty(oid) && !_.isEmpty(team) && !_.isEmpty(uid)) {
                // determin whether this invocation should be traced based on values stored in cache
                // the format of key is "TEAM_ID|UID|PATH"
                // the cache key is being used as { team: team, collection: uid, id: path }
                if (await this._cache.getBuffer(`${team}|${uid}|*`)) {
                    // when we find cache in { team, uid, * } is means all invocation should be traced for this team and user
                    await this.traceImpl(oid, team, uid, target.constructor.name, propertyKey, args);
                }
                else if (await this._cache.getBuffer(`${team}|${uid}|${path}`)) {
                    // check if we can find cache exactly for the path and trace it
                    await this.traceImpl(oid, team, uid, target.constructor.name, propertyKey, args);
                }
                else {
                    // cannot find { team, uid, * } as well as { team, uid, exactly path }
                    // we will check cache based on path was defined for each segments
                    // for example if the incoming path was "/foo/bar/baz?id=1&name=shaun"
                    // we will check the path part of cache key in "/foo", "/foo/bar" and "/foo/bar/baz"
                    // and if ang of them we found it should be traced
                    const pathnames = (_.first(path.split("?")) as string).split(sep).filter(x => !_.isEmpty(x));
                    let i = 1;
                    while (i <= pathnames.length) {
                        const pathKey = `/${_.take(pathnames, i).join(sep)}`;
                        if (await this._cache.getBuffer(`${team}|${uid}|${pathKey}`)) {
                            await this.traceImpl(oid, team, uid, target.constructor.name, propertyKey, args);
                            break;
                        }
                        i++;
                    }
                }
            }
        }
    }

    public handle<T extends object>(instance: T): T {
        const self = this;
        const handler: ProxyHandler<T> = {
            // do NOT use arrow function since later we need to use "this" as the original function to process the original routine
            get: function (target: T, propertyKey: string, receiver?: any) {
                const property = (<any>target)[propertyKey];
                if (_.isFunction(property) || _.isAsyncFunction(property)) {
                    // constructor should NOT be proxy-ed
                    if (propertyKey === "constructor") {
                        return Reflect.get(target, propertyKey, receiver);
                    }
                    else {
                        // do NOT use arrow function since later we need to use "this" as the original function to process the original routine
                        return function (this: any, ...args: any[]) {
                            const options: TraceOptions = Reflect.getMetadata(`wt-trace-options:${propertyKey}`, target) || new TraceOptions();
                            self.trace(target, propertyKey, args, options);
                            // "this" means the original function container which being used to perform the original routine
                            return property.apply(this, args);
                        };
                    }
                }
                else {
                    return Reflect.get(target, propertyKey, receiver);
                }
            }
        };
        return new Proxy(instance, handler);
    }

}

export { ActivityTracingActivationHandler };
