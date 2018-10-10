"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("./plugin");
const drivers_1 = require("../drivers");
const _ = __importStar(require("../../utilities"));
class ReadWriteStrategyPlugin extends plugin_1.Plugin {
    constructor(findStrategy, aggregateStrategy, mapReduceStrategy) {
        super("read-write-strategy");
        this._findStrategy = findStrategy;
        this._aggregateStrategy = aggregateStrategy;
        this._mapReduceStrategy = mapReduceStrategy;
    }
    async beforeCount(context) {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }
    async beforeFindOne(context) {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }
    async beforeFindOneById(context) {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }
    async beforeFindByIds(context) {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }
    async beforeFindByPageIndex(context) {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }
    async beforeFindByPageNext(context) {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }
    async beforeAggregate(context) {
        context.options = _.assign({}, context.options, {
            readPreference: this._aggregateStrategy
        });
    }
    async beforeMapReduce(context) {
        context.options = _.assign({}, context.options, {
            readPreference: this._mapReduceStrategy
        });
    }
}
ReadWriteStrategyPlugin.PRIMARY = new ReadWriteStrategyPlugin(drivers_1.ReadPreference.primary, drivers_1.ReadPreference.primary, drivers_1.ReadPreference.primary);
ReadWriteStrategyPlugin.READ_SECONDARY = new ReadWriteStrategyPlugin(drivers_1.ReadPreference.secondaryPreferred, drivers_1.ReadPreference.secondary, drivers_1.ReadPreference.secondary);
ReadWriteStrategyPlugin.AGGREGATE_SECONDARY = new ReadWriteStrategyPlugin(drivers_1.ReadPreference.primary, drivers_1.ReadPreference.secondary, drivers_1.ReadPreference.secondary);
exports.ReadWriteStrategyPlugin = ReadWriteStrategyPlugin;
//# sourceMappingURL=plugin-read-write-strategy.js.map