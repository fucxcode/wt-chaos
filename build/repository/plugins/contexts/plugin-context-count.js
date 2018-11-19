"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
class CountPluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, driverName, collectionName, condition, options) {
        super(operationDescription, driverName, collectionName, "count", 0);
        this.condition = condition;
        this.options = options;
    }
}
exports.CountPluginContext = CountPluginContext;
//# sourceMappingURL=plugin-context-count.js.map