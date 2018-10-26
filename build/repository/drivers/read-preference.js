"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReadPreference;
(function (ReadPreference) {
    ReadPreference["primary"] = "primary";
    ReadPreference["primaryPreferred"] = "primaryPreferred";
    ReadPreference["secondary"] = "secondary";
    ReadPreference["secondaryPreferred"] = "secondaryPreferred";
    ReadPreference["nearest"] = "nearest";
})(ReadPreference = exports.ReadPreference || (exports.ReadPreference = {}));
class ReadWriteStrategy {
    constructor(findStrategy, aggregateStrategy, mapReduceStrategy) {
        this._findStrategy = findStrategy;
        this._aggregateStrategy = aggregateStrategy;
        this._mapReduceStrategy = mapReduceStrategy;
    }
    get findStrategy() {
        return this._findStrategy;
    }
    get aggregateStrategy() {
        return this._aggregateStrategy;
    }
    get mapReduceStrategy() {
        return this._mapReduceStrategy;
    }
}
ReadWriteStrategy.PRIMARY = new ReadWriteStrategy(ReadPreference.primary, ReadPreference.primary, ReadPreference.primary);
ReadWriteStrategy.READ_SECONDARY = new ReadWriteStrategy(ReadPreference.secondaryPreferred, ReadPreference.secondaryPreferred, ReadPreference.secondaryPreferred);
ReadWriteStrategy.AGGREGATE_SECONDARY = new ReadWriteStrategy(ReadPreference.primary, ReadPreference.secondaryPreferred, ReadPreference.secondaryPreferred);
exports.ReadWriteStrategy = ReadWriteStrategy;
//# sourceMappingURL=read-preference.js.map