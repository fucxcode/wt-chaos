"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
const constants_1 = require("../../../constants");
class UpdateByEntityPluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, collectionName, driverName, entity, condition, options) {
        super(operationDescription, collectionName, driverName, "updateByEntity", {
            ok: constants_1.is.yes,
            n: 0,
            nModified: 0
        });
        this.entity = entity;
        this.condition = condition;
        this.options = options;
    }
}
exports.UpdateByEntityPluginContext = UpdateByEntityPluginContext;
//# sourceMappingURL=plugin-context-update-by-entity.js.map