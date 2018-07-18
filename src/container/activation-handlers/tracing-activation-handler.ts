import * as mongodb from "mongodb";
import { sep } from "path";

import * as _ from "../../utilities";
import { IActivationHandler } from "./i-activation-handler";
import { TraceOptions } from "./trace-decorator";
import CacheKey from "../../cache/cache-key";
import ICache from "../../cache/i-cache";

class ActivityTracingActivationHandler implements IActivationHandler {

    private _cache: ICache;

    private _collection!: mongodb.Collection;

    private _ready: boolean;

    private _block: boolean;

    constructor(cache: ICache, options: {
        db: {
            server: string,
            database: string,
            collection: string
        },
        block: boolean
    }) {
        this._cache = cache;
        this._ready = false;
        this._block = options.block;

        mongodb.MongoClient.connect(options.db.server).then(client => {
            const db = client.db(options.db.database);
            this._collection = db.collection(options.db.collection);
            this._ready = true;
        }).catch(error => {
            // well i think it's fine when failed to connect database for activity tracing
            // since this is not a critical issue, hopefully
        });
    }

    private async traceImpl(oid: string, team: mongodb.ObjectId, uid: string, className: string, methodName: string, args: any[]): Promise<void> {
        await this._collection.insertOne({
            oid: oid,
            timestamp: Date.now(),
            team: team,
            uid: uid,
            class_name: className,
            method_name: methodName,
            arguments: _.mapKeys(args, (value, key) => key.split(`$`).join(`__DOLLAR__`).split(`.`).join(`__DOT__`))
        });
    }

    private async trace(target: any, propertyKey: any, args: any[], options: TraceOptions): Promise<void> {
        if (options.enabled) {
            const oid = options.oidResolver(args) as string;
            const team = _.parseObjectId(options.teamIdResolver(args), false) as mongodb.ObjectId;
            const uid = options.uidResolver(args) as string;
            const path = options.pathResolver(args);
            if (!_.isEmpty(oid) && !_.isEmpty(team) && !_.isEmpty(uid)) {
                if (this._ready && this._collection) {
                    // determin whether this invocation should be traced based on values stored in cache
                    // the cache key is being used as { team: team, collection: uid, id: path }
                    const widecardPathKey = new CacheKey(team.toString(), uid, "*");
                    if (await this._cache.getByKey(widecardPathKey)) {
                        // when we find cache in { team, uid, * } is means all invocation should be traced for this team and user
                        await this.traceImpl(oid, team, uid, target.constructor.name, propertyKey, args);
                    }
                    else if (await this._cache.getByKey(new CacheKey(team.toString(), uid, path))) {
                        // check if we can find cache exactly for the path and trace it
                        await this.traceImpl(oid, team, uid, target.constructor.name, propertyKey, args);
                    }
                    else {
                        // cannot find { team, uid, * } as well as { team, uid, exactly path }
                        // we will check cache based on path was defined for each segments
                        // for example if the incoming path was "/foo/bar/baz?id=1&name=shaun"
                        // we will check the path part of cache key in "/foo", "/foo/bar" and "/foo/bar/baz"
                        // and if ang of them we found it should be traced
                        const pathnames = _.first(path.split("?")).split(sep).filter(x => !_.isEmpty(x));
                        let i = 1;
                        while (i <= pathnames.length) {
                            const pathKey = `/${_.take(pathnames, i).join(sep)}`;
                            const key = new CacheKey(team.toString(), uid, pathKey);
                            if (await this._cache.getByKey(key)) {
                                await this.traceImpl(oid, team, uid, target.constructor.name, propertyKey, args);
                                break;
                            }
                            i++;
                        }
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
                        return function (...args: any[]) {
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
