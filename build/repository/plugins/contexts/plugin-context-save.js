"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
class SavePluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, collectionName, driverName, entityOrArray, options) {
        super(operationDescription, collectionName, driverName, "save", undefined);
        this.entityOrArray = entityOrArray;
        this.options = options;
    }
}
exports.SavePluginContext = SavePluginContext;
//# sourceMappingURL=plugin-context-save.js.map