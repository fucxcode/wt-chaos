import { Container, ContainerPool } from "../../container";
import { Session } from "./session";
import { Id } from "../entities/id";
import { Driver } from "./driver";

class DriverExtensions {

    private static readonly DEFAULT_DRIVER_KEY = Symbol.for("default_driver");

    public static setDefault<TSession extends Session, TID extends Id, TDriver extends Driver<TSession, TID>>(driver: TDriver, container: Container | undefined = ContainerPool.getDefaultContainer()): void {
        if (container) {
            container.registerInstance(DriverExtensions.DEFAULT_DRIVER_KEY, driver);
        }
        else {
            throw new Error("cannot get default container");
        }
    }

    public static getDefault<TSession extends Session, TID extends Id, TDriver extends Driver<TSession, TID>>(container: Container | undefined = ContainerPool.getDefaultContainer()): TDriver {
        if (container) {
            const driver = container.resolve<TDriver>(DriverExtensions.DEFAULT_DRIVER_KEY);
            if (driver) {
                return driver;
            }
            else {
                throw new Error("cannot get default driver from container");
            }
        }
        else {
            throw new Error("cannot get default container");
        }
    }

}

export { DriverExtensions };