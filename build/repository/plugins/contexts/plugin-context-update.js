"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
const constants_1 = require("../../../constants");
class UpdatePluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, collectionName, driverName, condition, update, options) {
        super(operationDescription, collectionName, driverName, "update", {
            ok: constants_1.is.yes,
            n: 0,
            nModified: 0
        });
        this.condition = condition;
        this.update = update;
        this.options = options;
    }
}
exports.UpdatePluginContext = UpdatePluginContext;
//# sourceMappingURL=plugin-context-update.js.map