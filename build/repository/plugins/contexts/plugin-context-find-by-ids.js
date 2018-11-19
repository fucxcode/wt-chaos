"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
class FindByIdsPluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, driverName, collectionName, ids, condition, options) {
        super(operationDescription, driverName, collectionName, "findByIds", []);
        this.ids = ids;
        this.condition = condition;
        this.options = options;
    }
}
exports.FindByIdsPluginContext = FindByIdsPluginContext;
//# sourceMappingURL=plugin-context-find-by-ids.js.map