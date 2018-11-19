"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
class FindOneByIdPluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, driverName, collectionName, id, condition, options) {
        super(operationDescription, driverName, collectionName, "findOneById", undefined);
        this.id = id;
        this.condition = condition;
        this.options = options;
    }
}
exports.FindOneByIdPluginContext = FindOneByIdPluginContext;
//# sourceMappingURL=plugin-context-find-one-by-id.js.map