import { Container } from "../../container";
import { Session } from "./session";
import { Id } from "../entities/id";
import { Driver } from "./driver";
declare class DriverExtensions {
    private static readonly DEFAULT_DRIVER_KEY;
    static setDefault<TSession extends Session, TID extends Id, TDriver extends Driver<TSession, TID>>(driver: TDriver, container?: Container | undefined): void;
    static getDefault<TSession extends Session, TID extends Id, TDriver extends Driver<TSession, TID>>(container?: Container | undefined): TDriver;
}
export { DriverExtensions };
