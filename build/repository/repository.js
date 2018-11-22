"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../utilities"));
const constants_1 = require("../constants");
const errors_1 = require("../errors");
const plugin_context_save_1 = require("./plugins/contexts/plugin-context-save");
const plugin_context_count_1 = require("./plugins/contexts/plugin-context-count");
const plugin_context_find_one_1 = require("./plugins/contexts/plugin-context-find-one");
const plugin_context_find_one_by_id_1 = require("./plugins/contexts/plugin-context-find-one-by-id");
const plugin_context_find_by_ids_1 = require("./plugins/contexts/plugin-context-find-by-ids");
const plugin_context_find_by_page_index_1 = require("./plugins/contexts/plugin-context-find-by-page-index");
const plugin_context_find_by_page_next_1 = require("./plugins/contexts/plugin-context-find-by-page-next");
const plugin_context_update_1 = require("./plugins/contexts/plugin-context-update");
const plugin_context_update_by_id_1 = require("./plugins/contexts/plugin-context-update-by-id");
const plugin_context_update_by_ids_1 = require("./plugins/contexts/plugin-context-update-by-ids");
const plugin_context_update_by_entity_1 = require("./plugins/contexts/plugin-context-update-by-entity");
const plugin_context_erase_1 = require("./plugins/contexts/plugin-context-erase");
const plugin_context_find_one_update_1 = require("./plugins/contexts/plugin-context-find-one-update");
const plugin_context_find_one_update_by_entity_1 = require("./plugins/contexts/plugin-context-find-one-update-by-entity");
const plugin_context_aggregate_1 = require("./plugins/contexts/plugin-context-aggregate");
const plugin_context_map_reduce_1 = require("./plugins/contexts/plugin-context-map-reduce");
const find_by_page_index_result_1 = require("./find-by-page-index-result");
exports.FindByPageIndexResult = find_by_page_index_result_1.FindByPageIndexResult;
const find_by_page_next_result_1 = require("./find-by-page-next-result");
exports.FindByPageNextResult = find_by_page_next_result_1.FindByPageNextResult;
const driver_extensions_1 = require("./drivers/driver-extensions");
class Repository {
    constructor(collectionName, driverProvider = driver_extensions_1.DriverExtensions.getDefault, plugins = []) {
        this._collectionName = collectionName;
        this._driverProvider = driverProvider;
        this._plugins = plugins;
    }
    get driver() {
        return this._driverProvider();
    }
    get plugins() {
        return this._plugins;
    }
    get collectionName() {
        return this._collectionName;
    }
    async processPluginBeforeActions(context, action) {
        for (let i = 0; i < this._plugins.length; i++) {
            const plugin = this._plugins[i];
            await action.call(plugin, plugin, context);
        }
    }
    async processPluginAfterActions(context, action) {
        for (let i = this._plugins.length - 1; i >= 0; i--) {
            const plugin = this._plugins[i];
            await action.call(plugin, plugin, context);
        }
    }
    async onSave(context) {
        context.result = _.isArray(context.entityOrArray) ?
            await this.driver.insertMany(this._collectionName, context.entityOrArray, context.options) :
            await this.driver.insertOne(this._collectionName, context.entityOrArray, context.options);
    }
    async save(operationDescription, entityOrArray, options) {
        const context = new plugin_context_save_1.SavePluginContext(operationDescription, this._driverProvider.name, this._collectionName, entityOrArray, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeSave(c));
        if (!context.cancel) {
            await this.onSave(context);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterSave(c));
        return context.result;
    }
    async onCount(context) {
        context.result = await this.driver.count(this._collectionName, context.condition, context.options);
    }
    async count(operationDescription, condition, options) {
        const context = new plugin_context_count_1.CountPluginContext(operationDescription, this._driverProvider.name, this._collectionName, condition, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeCount(c));
        if (!context.cancel) {
            await this.onCount(context);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterCount(c));
        return context.result;
    }
    async onFind(operationDescription, condition, options) {
        return await this.driver.find(this._collectionName, condition, options);
    }
    async findOneInternal(operationDescription, condition, throwErrorWhenMultipleDocuments = false, options) {
        const limit = throwErrorWhenMultipleDocuments ? 2 : 1;
        const entities = await this.onFind(operationDescription, condition, _.assign({}, options, {
            limit: limit
        }));
        if (entities.length > 1) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "expected one document but retrieve multiple by condition", null, entities);
        }
        else {
            return _.first(entities);
        }
    }
    async findOne(operationDescription, condition, throwErrorWhenMultipleDocuments = false, options) {
        const context = new plugin_context_find_one_1.FindOnePluginContext(operationDescription, this._driverProvider.name, this._collectionName, condition, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeFindOne(c));
        if (!context.cancel) {
            context.result = await this.findOneInternal(operationDescription, context.condition, throwErrorWhenMultipleDocuments, context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterFindOne(c));
        return context.result;
    }
    async findOneById(operationDescription, id, condition, options) {
        const context = new plugin_context_find_one_by_id_1.FindOneByIdPluginContext(operationDescription, this._driverProvider.name, this._collectionName, id, condition, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeFindOneById(c));
        if (!context.cancel) {
            context.result = await this.findOneInternal(operationDescription, _.assign({}, context.condition, {
                _id: context.id
            }), false, context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterFindOneById(c));
        return context.result;
    }
    async findByIds(operationDescription, ids, condition, options) {
        const context = new plugin_context_find_by_ids_1.FindByIdsPluginContext(operationDescription, this._driverProvider.name, this._collectionName, ids, condition, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeFindByIds(c));
        if (!context.cancel) {
            context.result = await this.onFind(operationDescription, _.assign({}, context.condition, {
                _id: {
                    $in: context.ids
                }
            }), context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterFindByIds(c));
        return context.result;
    }
    async findByPageIndex(operationDescription, condition, pageIndex = 0, pageSize = constants_1.DEFAULT_PAGE_SIZE, options = {}) {
        const context = new plugin_context_find_by_page_index_1.FindByPageIndexPluginContext(operationDescription, this._driverProvider.name, this._collectionName, condition, pageIndex, pageSize, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeFindByPageIndex(c));
        if (!context.cancel) {
            // ensure `pageIndex`, `pageSize` are numbers
            context.pageIndex = Number(context.pageIndex);
            context.pageSize = Number(context.pageSize);
            // ensure `pageIndex`, `pageSize` are valid
            context.pageIndex = context.pageIndex >= 0 ? context.pageIndex : 0;
            context.pageSize = context.pageSize > 0 ? (context.pageSize > constants_1.DEFAULT_PAGE_SIZE_LIMIT ? context.pageSize = constants_1.DEFAULT_PAGE_SIZE_LIMIT : context.pageSize) : constants_1.DEFAULT_PAGE_SIZE;
            // build `skip` and `limit` based on `pageIndex` and `pageSize`
            const skip = context.pageIndex * context.pageSize;
            const limit = context.pageSize;
            // build `sort` based on `sort` and ensure the last sort key is `[_id, 1]`
            const sort = context.options.sort || [];
            sort.push([
                "_id",
                1
            ]);
            // retrieve the result list and total count in order to calculate the output page count
            const [entities, count] = await Promise.all([
                this.onFind(operationDescription, context.condition, _.assign({}, context.options, {
                    skip: skip,
                    limit: limit,
                    sort: sort
                })),
                this.count(operationDescription, context.condition, {
                    hint: context.options.hint,
                    readPreference: context.options.readPreference,
                    includes: context.options.includes
                })
            ]);
            context.result = new find_by_page_index_result_1.FindByPageIndexResult(entities, context.pageIndex, context.pageSize, count);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterFindByPageIndex(c));
        return context.result;
    }
    async findByPageNext(operationDescription, condition, pageIndex = 0, pageSize = constants_1.DEFAULT_PAGE_SIZE, options = {}) {
        const context = new plugin_context_find_by_page_next_1.FindByPageNextPluginContext(operationDescription, this._driverProvider.name, this._collectionName, condition, pageIndex, pageSize, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeFindByPageNext(c));
        if (!context.cancel) {
            // ensure `pageIndex`, `pageSize` are numbers
            context.pageIndex = Number(context.pageIndex);
            context.pageSize = Number(context.pageSize);
            // ensure `pageIndex`, `pageSize` are valid
            context.pageIndex = context.pageIndex >= 0 ? context.pageIndex : 0;
            context.pageSize = context.pageSize > 0 ? (context.pageSize > constants_1.DEFAULT_PAGE_SIZE_LIMIT ? context.pageSize = constants_1.DEFAULT_PAGE_SIZE_LIMIT : context.pageSize) : constants_1.DEFAULT_PAGE_SIZE;
            // build `skip` and `limit` based on `pageIndex` and `pageSize`
            // retrieve one more entity to check if there will be the next page
            const skip = context.pageIndex * context.pageSize;
            const limit = context.pageSize + 1;
            // build `sort` based on `sort` and ensure the last sort key is `[_id, 1]`
            const sort = context.options.sort || [];
            sort.push([
                "_id",
                1
            ]);
            // retrieve the result list (+1 entities)
            const entitiesOneMore = await this.onFind(operationDescription, context.condition, _.assign({}, context.options, {
                skip: skip,
                limit: limit,
                sort: sort
            }));
            const entities = _.take(entitiesOneMore, context.pageSize);
            const next = entitiesOneMore.length > entities.length;
            context.result = new find_by_page_next_result_1.FindByPageNextResult(entities, context.pageIndex, context.pageSize, next);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterFindByPageNext(c));
        return context.result;
    }
    parseUpdate(update) {
        const result = {};
        const setter_$set = update.$set || {};
        // if `setter` only contains properties to update, we will put them into `$set` property
        // if `setter` contains some operations starts with `$` such as `$push`, `$pull`, etc, we will copy them
        // should never update `_id` for the top document
        _.forOwn(update, (value, key) => {
            if (key !== `_id`) {
                if (_.startsWith(key, `$`)) {
                    result[key] = value;
                }
                else {
                    setter_$set[key] = value;
                }
            }
        });
        if (!_.isEmpty(setter_$set)) {
            result.$set = setter_$set;
        }
        return result;
    }
    parseUpdateFromEntity(entity) {
        // remove entity properties those value were `NaN` or `undefined` since when update by entity they should be ignored
        const update = _.cloneDeep(entity);
        for (const key in update) {
            if (update.hasOwnProperty(key)) {
                if (_.isUndefined(update[key]) || _.isNaN(update[key])) {
                    delete update[key];
                }
            }
        }
        return update;
    }
    async onUpdate(operationDescription, condition, update, multi = false, options) {
        update = this.parseUpdate(update);
        return multi ?
            await this.driver.updateMany(this._collectionName, condition, update, options) :
            await this.driver.updateOne(this._collectionName, condition, update, options);
    }
    async update(operationDescription, condition, update, multi = false, options) {
        const context = new plugin_context_update_1.UpdatePluginContext(operationDescription, this._driverProvider.name, this._collectionName, condition, update, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeUpdate(c));
        if (!context.cancel) {
            context.result = await this.onUpdate(operationDescription, context.condition, context.update, multi, context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterUpdate(c));
        return context.result;
    }
    async updateById(operationDescription, id, condition, update, options) {
        const context = new plugin_context_update_by_id_1.UpdateByIdPluginContext(operationDescription, this._driverProvider.name, this._collectionName, id, condition, update, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeUpdateById(c));
        if (!context.cancel) {
            context.result = await this.onUpdate(operationDescription, _.assign({}, context.condition, {
                _id: context.id
            }), context.update, false, context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterUpdateById(c));
        return context.result;
    }
    async updateByIds(operationDescription, ids, condition, update, options) {
        const context = new plugin_context_update_by_ids_1.UpdateByIdsPluginContext(operationDescription, this._driverProvider.name, this._collectionName, ids, condition, update, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeUpdateByIds(c));
        if (!context.cancel) {
            context.result = await this.onUpdate(operationDescription, _.assign({}, context.condition, {
                _id: {
                    $in: context.ids
                }
            }), context.update, true, context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterUpdateByIds(c));
        return context.result;
    }
    async updateByEntity(operationDescription, entity, condition, options) {
        const context = new plugin_context_update_by_entity_1.UpdateByEntityPluginContext(operationDescription, this._driverProvider.name, this._collectionName, entity, condition, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeUpdateByEntity(c));
        if (!context.cancel) {
            context.result = await this.onUpdate(operationDescription, _.assign(context.condition, {
                _id: context.entity._id
            }), this.parseUpdateFromEntity(context.entity), false, context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterUpdateByEntity(c));
        return context.result;
    }
    async onErase(context, multi) {
        context.result = multi ?
            await this.driver.deleteMany(this._collectionName, context.condition, context.options) :
            await this.driver.deleteOne(this._collectionName, context.condition, context.options);
    }
    async erase(operationDescription, condition, multi = false, options) {
        const context = new plugin_context_erase_1.ErasePluginContext(operationDescription, this._driverProvider.name, this._collectionName, condition, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeErase(c));
        if (!context.cancel) {
            await this.onErase(context, multi);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterErase(c));
        return context.result;
    }
    async onFindOneAndUpdate(operationDescription, condition, update, options) {
        return await this.driver.findOneAndUpdate(this._collectionName, condition, this.parseUpdate(update), options);
    }
    async findOneAndUpdate(operationDescription, condition, update, options) {
        const context = new plugin_context_find_one_update_1.FindOneAndUpdatePluginContext(operationDescription, this._driverProvider.name, this._collectionName, condition, update, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeFindOneAndUpdate(c));
        if (!context.cancel) {
            context.result = await this.onFindOneAndUpdate(operationDescription, context.condition, this.parseUpdate(context.update), context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterFindOneAndUpdate(c));
        return context.result;
    }
    async findOneAndUpdateByEntity(operationDescription, entity, condition, options) {
        const context = new plugin_context_find_one_update_by_entity_1.FindOneAndUpdateByEntityPluginContext(operationDescription, this._driverProvider.name, this._collectionName, entity, condition, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeFindOneAndUpdateByEntity(c));
        if (!context.cancel) {
            context.result = await this.onFindOneAndUpdate(operationDescription, _.assign({}, context.condition, {
                _id: context.entity._id
            }), this.parseUpdateFromEntity(context.entity), context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterFindOneAndUpdateByEntity(c));
        return context.result;
    }
    initializeBulkOp(operationDescription, ordered = false) {
        return this.driver.initializeBulkOp(this._collectionName, ordered);
    }
    async aggregate(operationDescription, pipeline, options) {
        const context = new plugin_context_aggregate_1.AggregatePluginContext(operationDescription, this._driverProvider.name, this._collectionName, pipeline, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeAggregate(c));
        if (!context.cancel) {
            context.result = await this.driver.aggregate(this._collectionName, context.pipeline, context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterAggregate(c));
        return context.result;
    }
    async mapReduce(operationDescription, map, reduce, options) {
        const context = new plugin_context_map_reduce_1.MapReducePluginContext(operationDescription, this._driverProvider.name, this._collectionName, map, reduce, options);
        await this.processPluginBeforeActions(context, (p, c) => p.beforeMapReduce(c));
        if (!context.cancel) {
            context.result = await this.driver.mapReduce(this._collectionName, context.map, context.reduce, context.options);
        }
        await this.processPluginAfterActions(context, (p, c) => p.afterMapReduce(c));
        return context.result;
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map