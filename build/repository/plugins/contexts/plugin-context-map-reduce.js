"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
class MapReducePluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, driverName, collectionName, map, reduce, options) {
        super(operationDescription, driverName, collectionName, "mapReduce", []);
        this.map = map;
        this.reduce = reduce;
        this.options = options;
    }
}
exports.MapReducePluginContext = MapReducePluginContext;
//# sourceMappingURL=plugin-context-map-reduce.js.map