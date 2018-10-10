"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
class AggregatePluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, collectionName, driverName, pipeline, options) {
        super(operationDescription, collectionName, driverName, "aggregate", []);
        this.pipeline = pipeline;
        this.options = options;
    }
}
exports.AggregatePluginContext = AggregatePluginContext;
//# sourceMappingURL=plugin-context-aggregate.js.map