"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MongoReport {
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
//# sourceMappingURL=mongo.js.map