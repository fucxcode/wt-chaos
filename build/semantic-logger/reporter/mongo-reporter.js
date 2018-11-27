"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../../repository");
class MongoReport {
    get driver() {
        return this._driverProvider();
    }
    // // TODO: make driver optional; if true, pull an instance from container
    constructor(collection, driverProvider, insertOpts) {
        this.collection = collection;
        this.insertOptions = insertOpts;
        this._driverProvider = driverProvider || repository_1.DriverExtensions.getDefault;
    }
    async report(entity) {
        const result = await this.driver.insertOne(this.collection, entity, this.insertOptions);
        return result;
    }
    async query(filter) {
        return this.driver.find(this.collection, Object.assign({}, filter));
    }
}
exports.MongoReport = MongoReport;
//# sourceMappingURL=mongo-reporter.js.map