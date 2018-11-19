"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
const find_by_page_next_result_1 = require("../../find-by-page-next-result");
class FindByPageNextPluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, driverName, collectionName, condition, pageIndex, pageSize, options) {
        super(operationDescription, driverName, collectionName, "findByPageNext", new find_by_page_next_result_1.FindByPageNextResult([], pageIndex, pageSize, false));
        this.condition = condition;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.options = options;
    }
}
exports.FindByPageNextPluginContext = FindByPageNextPluginContext;
//# sourceMappingURL=plugin-context-find-by-page-next.js.map