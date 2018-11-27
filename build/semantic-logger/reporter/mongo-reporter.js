"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../../repository");
class MongoReport {
    // // TODO: make driver optional; if true, pull an instance from container
    constructor(collection, driverProvider, insertOpts) {
        this._driverProvider = repository_1.DriverExtensions.getDefault;
        this.collection = collection;
        this.insertOptions = insertOpts;
        this._driverProvider = driverProvider;
    }
    get driver() {
        return this._driverProvider();
    }
    async report(entity) {
        const result = await this.driver.insertOne(this.collection, entity, this.insertOptions);
        return result;
    }
}
exports.MongoReport = MongoReport;
//# sourceMappingURL=mongo-reporter.js.map