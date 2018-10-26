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
    constructor(strategy) {
        super("read-write-strategy");
        this._strategy = strategy;
    }
    async beforeCount(context) {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }
    async beforeFindOne(context) {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }
    async beforeFindOneById(context) {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }
    async beforeFindByIds(context) {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }
    async beforeFindByPageIndex(context) {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }
    async beforeFindByPageNext(context) {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }
    async beforeAggregate(context) {
        context.options = _.assign({}, {
            readPreference: this._strategy.aggregateStrategy
        }, context.options);
    }
    async beforeMapReduce(context) {
        context.options = _.assign({}, {
            readPreference: this._strategy.mapReduceStrategy
        }, context.options);
    }
}
ReadWriteStrategyPlugin.PRIMARY = new ReadWriteStrategyPlugin(drivers_1.ReadWriteStrategy.PRIMARY);
ReadWriteStrategyPlugin.READ_SECONDARY = new ReadWriteStrategyPlugin(drivers_1.ReadWriteStrategy.READ_SECONDARY);
ReadWriteStrategyPlugin.AGGREGATE_SECONDARY = new ReadWriteStrategyPlugin(drivers_1.ReadWriteStrategy.AGGREGATE_SECONDARY);
exports.ReadWriteStrategyPlugin = ReadWriteStrategyPlugin;
//# sourceMappingURL=plugin-read-write-strategy.js.map