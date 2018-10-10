"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_context_1 = require("./plugin-context");
const find_by_page_index_result_1 = require("../../find-by-page-index-result");
class FindByPageIndexPluginContext extends plugin_context_1.PluginContext {
    constructor(operationDescription, collectionName, driverName, condition, pageIndex, pageSize, options) {
        super(operationDescription, collectionName, driverName, "findByPageIndex", new find_by_page_index_result_1.FindByPageIndexResult([], pageIndex, pageSize, 0));
        this.condition = condition;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.options = options;
    }
}
exports.FindByPageIndexPluginContext = FindByPageIndexPluginContext;
//# sourceMappingURL=plugin-context-find-by-page-index.js.map