"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
const constants_1 = require("../../../constants");
class ErasePluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, collectionName, driverName, condition, options) {
        super(operationDescription, collectionName, driverName, "erase", {
            ok: constants_1.Is.yes,
            n: 0
        });
        this.condition = condition;
        this.options = options;
    }
}
exports.ErasePluginContext = ErasePluginContext;
//# sourceMappingURL=plugin-context-erase.js.map