"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../../utilities"));
const defaultOIDResolver = function (args) {
    if (args[0]) {
        if (args[0].context) {
            return args[0].context.oid;
        }
        else {
            return args[0].oid;
        }
    }
};
const defaultTeamIdResolver = function (args) {
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
const defaultUIDResolver = function (args) {
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
const defaultPathResolver = function (args) {
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
    constructor(enabled = true, oidResolver = defaultOIDResolver, teamIdResolver = defaultTeamIdResolver, uidResolver = defaultUIDResolver, pathResolver = defaultPathResolver) {
        this.enabled = enabled;
        this.oidResolver = oidResolver;
        this.teamIdResolver = teamIdResolver;
        this.uidResolver = uidResolver;
        this.pathResolver = pathResolver;
    }
}
exports.TraceOptions = TraceOptions;
const trace = function (enabled = true, oidResolver, teamIdResolver, uidResolver) {
    return function (target, propertyKey, value) {
        Reflect.defineMetadata(`wt-trace-options:${propertyKey}`, new TraceOptions(enabled, oidResolver, teamIdResolver, uidResolver), target);
    };
};
exports.trace = trace;
//# sourceMappingURL=trace-decorator.js.map