"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const _ = __importStar(require("../../utilities"));
const trace_decorator_1 = require("./trace-decorator");
class ActivityTracingActivationHandler {
    constructor(cache, driver, collectionName = `activity_traces`, throwException = false) {
        this._cache = cache;
        this._driver = driver;
        this._collectionName = collectionName;
        this._throwException = throwException;
    }
    async traceImpl(oid, team, uid, className, methodName, args) {
        try {
            await this._driver.insertOne(this._collectionName, {
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
    async trace(target, propertyKey, args, options) {
        if (options.enabled) {
            const oid = options.oidResolver(args);
            const team = this._driver.parseId(options.teamIdResolver(args));
            const uid = options.uidResolver(args);
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
                    const pathnames = _.first(path.split("?")).split(path_1.sep).filter(x => !_.isEmpty(x));
                    let i = 1;
                    while (i <= pathnames.length) {
                        const pathKey = `/${_.take(pathnames, i).join(path_1.sep)}`;
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
    handle(instance) {
        const self = this;
        const handler = {
            // do NOT use arrow function since later we need to use "this" as the original function to process the original routine
            get: function (target, propertyKey, receiver) {
                const property = target[propertyKey];
                if (_.isFunction(property) || _.isAsyncFunction(property)) {
                    // constructor should NOT be proxy-ed
                    if (propertyKey === "constructor") {
                        return Reflect.get(target, propertyKey, receiver);
                    }
                    else {
                        // do NOT use arrow function since later we need to use "this" as the original function to process the original routine
                        return function (...args) {
                            const options = Reflect.getMetadata(`wt-trace-options:${propertyKey}`, target) || new trace_decorator_1.TraceOptions();
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
exports.ActivityTracingActivationHandler = ActivityTracingActivationHandler;
//# sourceMappingURL=tracing-activation-handler.js.map