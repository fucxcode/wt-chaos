import * as mongodb from "mongodb";
import * as constants from "../../constants";
declare class TraceOptions {
    enabled: boolean;
    oidResolver: (args: any[]) => string | undefined;
    teamIdResolver: (args: any[]) => constants.ObjectID | null | undefined;
    uidResolver: (args: any[]) => string | undefined;
    pathResolver: (args: any[]) => string;
    constructor(enabled?: boolean, oidResolver?: (args: any[]) => string | undefined, teamIdResolver?: (args: any[]) => constants.ObjectID | null | undefined, uidResolver?: (args: any[]) => string | undefined, pathResolver?: (args: any[]) => string);
}
declare const trace: (enabled?: boolean, oidResolver?: ((...args: any[]) => string) | undefined, teamIdResolver?: ((...args: any[]) => string | mongodb.ObjectID) | undefined, uidResolver?: ((...args: any[]) => string) | undefined) => (target: any, propertyKey: string, value: any) => void;
export { trace, TraceOptions };
