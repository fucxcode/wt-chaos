"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
class DriverExtensions {
    static setDefault(driver, container = container_1.ContainerPool.getDefaultContainer()) {
        if (container) {
            container.registerInstance(DriverExtensions.DEFAULT_DRIVER_KEY, driver);
        }
        else {
            throw new Error("cannot get default container");
        }
    }
    static getDefault(container = container_1.ContainerPool.getDefaultContainer()) {
        if (container) {
            const driver = container.resolve(DriverExtensions.DEFAULT_DRIVER_KEY);
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
DriverExtensions.DEFAULT_DRIVER_KEY = Symbol.for("default_driver");
exports.DriverExtensions = DriverExtensions;
//# sourceMappingURL=driver-extensions.js.map