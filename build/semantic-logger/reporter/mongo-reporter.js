"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MongoReport {
    // TODO: make driver optional; if true, pull an instance from container
    constructor(driver, collection, insertOpts) {
        this.driver = driver;
        this.collection = collection;
        this.insertOptions = insertOpts;
    }
    async report(entity) {
        const result = await this.driver.insertOne(this.collection, entity, this.insertOptions);
        return result;
    }
}
exports.MongoReport = MongoReport;
//# sourceMappingURL=mongo-reporter.js.map