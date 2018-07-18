import * as mongodb from "mongodb";

import * as _ from "../../utilities";
import * as constants from "../../constants";

const defaultOIDResolver = function (args: any[]): string | undefined {
    if (args[0]) {
        if (args[0].context) {
            return args[0].context.oid;
        }
        else {
            return args[0].oid;
        }
    }
};

const defaultTeamIdResolver = function (args: any[]): mongodb.ObjectId | null | undefined {
    if (args[0]) {
        if (args[0].context) {
            if (args[0].context.team) {
                return _.parseObjectId(args[0].context.team._id || args[0].context.team);
            }
        }
        else {
            if (args[0].team) {
                return _.parseObjectId(args[0].team._id || args[0].team);
            }
        }
    }
};

const defaultUIDResolver = function (args: any[]): string | undefined {
    if (args[0]) {
        if (args[0].context) {
            if (args[0].context.user) {
                return args[0].context.user.uid || args[0].context.user;
            }
        }
        else {
            if (args[0].user) {
                return args[0].user.uid || args[0].user;
            }
            else {
                return args[0].uid;
            }
        }
    }
};

const defaultPathResolver = function (args: any[]): string {
    if (args[0]) {
        if (args[0].context) {
            return args[0].context.path || "";
        }
        else {
            return args[0].path || "";
        }
    }
    return "";
};

class TraceOptions {

    constructor(
        public enabled: boolean = true,
        public oidResolver: (args: any[]) => string | undefined = defaultOIDResolver,
        public teamIdResolver: (args: any[]) => constants.ObjectID | null | undefined = defaultTeamIdResolver,
        public uidResolver: (args: any[]) => string | undefined = defaultUIDResolver,
        public pathResolver: (args: any[]) => string = defaultPathResolver
    ) { }

}

const trace = function (enabled: boolean = true,
    oidResolver?: (...args: any[]) => string,
    teamIdResolver?: (...args: any[]) => constants.ObjectID,
    uidResolver?: (...args: any[]) => string
) {
    return function (target: any, propertyKey: string, value: any) {
        Reflect.defineMetadata(`wt-trace-options:${propertyKey}`, new TraceOptions(enabled, oidResolver, teamIdResolver, uidResolver), target);
    };
};

export { trace, TraceOptions };