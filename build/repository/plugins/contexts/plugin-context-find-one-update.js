"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
class FindOneAndUpdatePluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, collectionName, driverName, condition, update, options) {
        super(operationDescription, collectionName, driverName, "findOneAndUpdate", undefined);
        this.condition = condition;
        this.update = update;
        this.options = options;
    }
}
exports.FindOneAndUpdatePluginContext = FindOneAndUpdatePluginContext;
//# sourceMappingURL=plugin-context-find-one-update.js.map