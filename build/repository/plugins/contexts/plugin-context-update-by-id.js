"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
const constants_1 = require("../../../constants");
class UpdateByIdPluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, collectionName, driverName, id, condition, update, options) {
        super(operationDescription, collectionName, driverName, "updateById", {
            ok: constants_1.is.yes,
            n: 0,
            nModified: 0
        });
        this.id = id;
        this.condition = condition;
        this.update = update;
        this.options = options;
    }
}
exports.UpdateByIdPluginContext = UpdateByIdPluginContext;
//# sourceMappingURL=plugin-context-update-by-id.js.map