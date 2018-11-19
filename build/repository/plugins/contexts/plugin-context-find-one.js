"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
class FindOnePluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, driverName, collectionName, condition, options) {
        super(operationDescription, driverName, collectionName, "findOne", undefined);
        this.condition = condition;
        this.options = options;
    }
}
exports.FindOnePluginContext = FindOnePluginContext;
//# sourceMappingURL=plugin-context-find-one.js.map