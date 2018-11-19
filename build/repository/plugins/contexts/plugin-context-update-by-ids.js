"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
const constants_1 = require("../../../constants");
class UpdateByIdsPluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, driverName, collectionName, ids, condition, update, options) {
        super(operationDescription, driverName, collectionName, "updateByIds", {
            ok: constants_1.Is.yes,
            n: 0,
            nModified: 0
        });
        this.ids = ids;
        this.condition = condition;
        this.update = update;
        this.options = options;
    }
}
exports.UpdateByIdsPluginContext = UpdateByIdsPluginContext;
//# sourceMappingURL=plugin-context-update-by-ids.js.map