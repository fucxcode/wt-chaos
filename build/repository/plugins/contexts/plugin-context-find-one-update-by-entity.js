"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
class FindOneAndUpdateByEntityPluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, driverName, collectionName, entity, condition, options) {
        super(operationDescription, driverName, collectionName, "findOneAndUpdateByEntity", undefined);
        this.entity = entity;
        this.condition = condition;
        this.options = options;
    }
}
exports.FindOneAndUpdateByEntityPluginContext = FindOneAndUpdateByEntityPluginContext;
//# sourceMappingURL=plugin-context-find-one-update-by-entity.js.map