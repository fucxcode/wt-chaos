import { Entity, Id } from "./entities";
import { Driver, InsertOneOptions, InsertManyOptions, CountOptions, FindOneOptions, FindOptions, UpdateOptions, UpdateResult, DeleteOptions, DeleteResult, FindOneAndUpdateOptions, BulkOperation, AggregateOptions, MapReduceOptions, Session } from "./drivers";
import { OperationDescription } from "./operation-desc";
import * as _ from "../utilities";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_LIMIT } from "../constants";
import { WTError, WTCode } from "../errors";
import { Plugin } from "./plugins/plugin";
import { PluginContext } from "./plugins/contexts/plugin-context";
import { CountPluginContext } from "./plugins/contexts/plugin-context-count";
import { FindOnePluginContext } from "./plugins/contexts/plugin-context-find-one";
import { FindOneByIdPluginContext } from "./plugins/contexts/plugin-context-find-one-by-id";
import { FindByIdsPluginContext } from "./plugins/contexts/plugin-context-find-by-ids";
import { FindByPageIndexPluginContext } from "./plugins/contexts/plugin-context-find-by-page-index";
import { FindByPageNextPluginContext } from "./plugins/contexts/plugin-context-find-by-page-next";
import { UpdatePluginContext } from "./plugins/contexts/plugin-context-update";
import { UpdateByIdPluginContext } from "./plugins/contexts/plugin-context-update-by-id";
import { UpdateByIdsPluginContext } from "./plugins/contexts/plugin-context-update-by-ids";
import { UpdateByEntityPluginContext } from "./plugins/contexts/plugin-context-update-by-entity";
import { ErasePluginContext } from "./plugins/contexts/plugin-context-erase";
import { FindOneAndUpdatePluginContext } from "./plugins/contexts/plugin-context-find-one-update";
import { FindOneAndUpdateByEntityPluginContext } from "./plugins/contexts/plugin-context-find-one-update-by-entity";
import { AggregatePluginContext } from "./plugins/contexts/plugin-context-aggregate";
import { MapReducePluginContext } from "./plugins/contexts/plugin-context-map-reduce";
import { FindByPageIndexResult } from "./find-by-page-index-result";
import { FindByPageNextResult } from "./find-by-page-next-result";
import { DriverExtensions } from "./drivers/driver-extensions";
import { getCollectionNameFromEntity, applyEntityDefaultValues } from "./decorators";
import { InsertOnePluginContext } from "./plugins/contexts/plugin-context-insert-one";
import { InsertManyPluginContext } from "./plugins/contexts/plugin-context-insert-many";

abstract class Repository<TSession extends Session, TID extends Id, TDriver extends Driver<TSession, TID>, TEntity extends Entity> {

    private _driverProvider: () => TDriver;
    public get driver(): TDriver {
        return this._driverProvider();
    }

    private _plugins: Plugin[];
    public get plugins(): Plugin[] {
        return this._plugins;
    }

    private _entityType: Function;

    private _collectionName: string;
    public get collectionName(): string {
        return this._collectionName;
    }

    private _defaultPageSize: number;

    private _defaultPageSizeLimit: number;

    constructor(EntityType: Function, driverProvider: () => TDriver = DriverExtensions.getDefault, plugins: Plugin[] = [], defaultPageSize: number = DEFAULT_PAGE_SIZE, pageSizeLimit: number = DEFAULT_PAGE_SIZE_LIMIT) {
        this._entityType = EntityType;
        this._collectionName = getCollectionNameFromEntity(EntityType);
        this._driverProvider = driverProvider;
        this._plugins = plugins;
        this._defaultPageSize = defaultPageSize;
        this._defaultPageSizeLimit = pageSizeLimit;
    }

    private async processPluginBeforeActions<TResult, TContext extends PluginContext<TResult>>(context: TContext, action: (plugin: Plugin, context: TContext) => Promise<void>): Promise<void> {
        for (let i = 0; i < this._plugins.length; i++) {
            const plugin = this._plugins[i];
            await action.call(plugin, plugin, context);
        }
    }

    private async processPluginAfterActions<TResult, TContext extends PluginContext<TResult>>(context: TContext, action: (plugin: Plugin, context: TContext) => Promise<void>): Promise<void> {
        for (let i = this._plugins.length - 1; i >= 0; i--) {
            const plugin = this._plugins[i];
            await action.call(plugin, plugin, context);
        }
    }

    protected async onInsertOne(context: InsertOnePluginContext<TEntity, TSession>): Promise<void> {
        context.result = await this.driver.insertOne(this._collectionName, context.entity, context.options);
    }

    public async insertOne(operationDescription: OperationDescription, entity: TEntity, options?: InsertOneOptions<TSession>): Promise<Partial<TEntity> | undefined> {
        const context = new InsertOnePluginContext<TEntity, TSession>(
            operationDescription,
            this._driverProvider.name,
            this._collectionName,
            applyEntityDefaultValues(this._entityType, entity, operationDescription, (id?: Id) => this._driverProvider().parseId(id, true)),
            options);
        await this.processPluginBeforeActions<Partial<TEntity> | undefined, InsertOnePluginContext<TEntity, TSession>>(context, (p, c) => p.beforeInsertOne(c));

        if (!context.cancel) {
            await this.onInsertOne(context);
        }

        await this.processPluginAfterActions<Partial<TEntity> | undefined, InsertOnePluginContext<TEntity, TSession>>(context, (p, c) => p.afterInsertOne(c));
        return context.result;
    }

    protected async onInsertMany(context: InsertManyPluginContext<TEntity, TSession>): Promise<void> {
        context.result = await this.driver.insertMany(this._collectionName, context.entities, context.options);
    }

    public async insertMany(operationDescription: OperationDescription, entities: TEntity[], options?: InsertOneOptions<TSession>): Promise<Partial<TEntity>[] | undefined> {
        const context = new InsertManyPluginContext<TEntity, TSession>(
            operationDescription,
            this._driverProvider.name,
            this._collectionName,
            _.map(entities, x => applyEntityDefaultValues(this._entityType, x, operationDescription, (id?: Id) => this._driverProvider().parseId(id, true))),
            options);
        await this.processPluginBeforeActions<Partial<TEntity>[] | undefined, InsertManyPluginContext<TEntity, TSession>>(context, (p, c) => p.beforeInsertMany(c));

        if (!context.cancel) {
            await this.onInsertMany(context);
        }

        await this.processPluginAfterActions<Partial<TEntity>[] | undefined, InsertManyPluginContext<TEntity, TSession>>(context, (p, c) => p.afterInsertMany(c));
        return context.result;
    }

    protected async onCount(context: CountPluginContext<TSession>): Promise<void> {
        context.result = await this.driver.count(this._collectionName, context.condition, context.options);
    }

    public async count(operationDescription: OperationDescription, condition?: any, options?: CountOptions<TSession>): Promise<number> {
        const context = new CountPluginContext<TSession>(operationDescription, this._driverProvider.name, this._collectionName, condition, options);
        await this.processPluginBeforeActions<number, CountPluginContext<TSession>>(context, (p, c) => p.beforeCount(c));

        if (!context.cancel) {
            await this.onCount(context);
        }

        await this.processPluginAfterActions<number, CountPluginContext<TSession>>(context, (p, c) => p.afterCount(c));
        return context.result;
    }

    protected async onFind(operationDescription: OperationDescription, condition?: any, options?: FindOptions<TEntity, TSession>): Promise<Partial<TEntity>[]> {
        return await this.driver.find<TEntity>(this._collectionName, condition, options);
    }

    private async findOneInternal(operationDescription: OperationDescription, condition?: any, throwErrorWhenMultipleDocuments: boolean = false, options?: FindOptions<TEntity, TSession>): Promise<Partial<TEntity> | undefined> {
        const limit = throwErrorWhenMultipleDocuments ? 2 : 1;
        const entities = await this.onFind(operationDescription, condition, _.assign({}, options, {
            limit: limit
        }));
        if (entities.length > 1) {
            throw new WTError(WTCode.invalidInput, "expected one document but retrieve multiple by condition", null, entities);
        }
        else {
            return _.first(entities);
        }
    }

    public async findOne(operationDescription: OperationDescription, condition?: any, throwErrorWhenMultipleDocuments: boolean = false, options?: FindOptions<TEntity, TSession>): Promise<Partial<TEntity> | undefined> {
        const context = new FindOnePluginContext<TEntity, TSession>(operationDescription, this._driverProvider.name, this._collectionName, condition, options);
        await this.processPluginBeforeActions<Partial<TEntity> | undefined, FindOnePluginContext<TEntity, TSession>>(context, (p, c) => p.beforeFindOne(c));

        if (!context.cancel) {
            context.result = await this.findOneInternal(operationDescription, context.condition, throwErrorWhenMultipleDocuments, context.options);
        }

        await this.processPluginAfterActions<Partial<TEntity> | undefined, FindOnePluginContext<TEntity, TSession>>(context, (p, c) => p.afterFindOne(c));
        return context.result;
    }

    public async findOneById(operationDescription: OperationDescription, id: Id, condition?: any, options?: FindOneOptions<TEntity, TSession>): Promise<Partial<TEntity> | undefined> {
        const context = new FindOneByIdPluginContext<TEntity, TSession>(operationDescription, this._driverProvider.name, this._collectionName, id, condition, options);
        await this.processPluginBeforeActions<Partial<TEntity> | undefined, FindOneByIdPluginContext<TEntity, TSession>>(context, (p, c) => p.beforeFindOneById(c));

        if (!context.cancel) {
            context.result = await this.findOneInternal(operationDescription, _.assign({}, context.condition, {
                _id: context.id
            }), false, context.options);
        }

        await this.processPluginAfterActions<Partial<TEntity> | undefined, FindOneByIdPluginContext<TEntity, TSession>>(context, (p, c) => p.afterFindOneById(c));
        return context.result;
    }

    public async findByIds(operationDescription: OperationDescription, ids: Id[], condition?: any, options?: FindOptions<TEntity, TSession>): Promise<Partial<TEntity>[]> {
        const context = new FindByIdsPluginContext<TEntity, TSession>(operationDescription, this._driverProvider.name, this._collectionName, ids, condition, options);
        await this.processPluginBeforeActions<Partial<TEntity>[], FindByIdsPluginContext<TEntity, TSession>>(context, (p, c) => p.beforeFindByIds(c));

        if (!context.cancel) {
            context.result = await this.onFind(operationDescription, _.assign({}, context.condition,
                {
                    _id: {
                        $in: context.ids
                    }
                }), context.options
            );
        }

        await this.processPluginAfterActions<Partial<TEntity>[], FindByIdsPluginContext<TEntity, TSession>>(context, (p, c) => p.afterFindByIds(c));
        return context.result;
    }

    public async findByPageIndex(operationDescription: OperationDescription, condition?: any, pageIndex: number = 0, pageSize: number = this._defaultPageSize, options: FindOptions<TEntity, TSession> = {}): Promise<FindByPageIndexResult<TEntity>> {
        const context = new FindByPageIndexPluginContext<TEntity, TSession>(operationDescription, this._driverProvider.name, this._collectionName, condition, pageIndex, pageSize, options);
        await this.processPluginBeforeActions<FindByPageIndexResult<TEntity>, FindByPageIndexPluginContext<TEntity, TSession>>(context, (p, c) => p.beforeFindByPageIndex(c));

        if (!context.cancel) {
            // ensure `pageIndex`, `pageSize` are numbers
            context.pageIndex = Number(context.pageIndex);
            context.pageSize = Number(context.pageSize);
            // ensure `pageIndex`, `pageSize` are valid
            context.pageIndex = context.pageIndex >= 0 ? context.pageIndex : 0;
            context.pageSize = context.pageSize > 0 ? (context.pageSize > this._defaultPageSizeLimit ? context.pageSize = this._defaultPageSizeLimit : context.pageSize) : this._defaultPageSize;

            // build `skip` and `limit` based on `pageIndex` and `pageSize`
            const skip = context.pageIndex * context.pageSize;
            const limit = context.pageSize;
            // retrieve the result list and total count in order to calculate the output page count
            const [entities, count] = await Promise.all([
                this.onFind(operationDescription, context.condition, _.assign({}, context.options, {
                    skip: skip,
                    limit: limit,
                    sort: context.options.sort
                })),
                this.count(operationDescription, context.condition, {
                    hint: context.options.hint,
                    readPreference: context.options.readPreference,
                    includes: context.options.includes      
                })
            ]);
            context.result = new FindByPageIndexResult<TEntity>(entities, context.pageIndex, context.pageSize, count);
        }

        await this.processPluginAfterActions<FindByPageIndexResult<TEntity>, FindByPageIndexPluginContext<TEntity, TSession>>(context, (p, c) => p.afterFindByPageIndex(c));
        return context.result;
    }

    public async findByPageNext(operationDescription: OperationDescription, condition?: any, pageIndex: number = 0, pageSize: number = this._defaultPageSize, options: FindOptions<TEntity, TSession> = {}): Promise<FindByPageNextResult<TEntity>> {
        const context = new FindByPageNextPluginContext<TEntity, TSession>(operationDescription, this._driverProvider.name, this._collectionName, condition, pageIndex, pageSize, options);
        await this.processPluginBeforeActions<FindByPageNextResult<TEntity>, FindByPageNextPluginContext<TEntity, TSession>>(context, (p, c) => p.beforeFindByPageNext(c));

        if (!context.cancel) {
            // ensure `pageIndex`, `pageSize` are numbers
            context.pageIndex = Number(context.pageIndex);
            context.pageSize = Number(context.pageSize);
            // ensure `pageIndex`, `pageSize` are valid
            context.pageIndex = context.pageIndex >= 0 ? context.pageIndex : 0;
            context.pageSize = context.pageSize > 0 ? (context.pageSize > this._defaultPageSizeLimit ? context.pageSize = this._defaultPageSizeLimit : context.pageSize) : this._defaultPageSize;

            // build `skip` and `limit` based on `pageIndex` and `pageSize`
            // retrieve one more entity to check if there will be the next page
            const skip = context.pageIndex * context.pageSize;
            const limit = context.pageSize + 1;
            // retrieve the result list (+1 entities)
            const entitiesOneMore = await this.onFind(operationDescription, context.condition, _.assign({}, context.options, {
                skip: skip,
                limit: limit,
                sort: context.options.sort
            }));
            const entities = _.take(entitiesOneMore, context.pageSize);
            const next = entitiesOneMore.length > entities.length;
            context.result = new FindByPageNextResult<TEntity>(entities, context.pageIndex, context.pageSize, next);
        }

        await this.processPluginAfterActions<FindByPageNextResult<TEntity>, FindByPageNextPluginContext<TEntity, TSession>>(context, (p, c) => p.afterFindByPageNext(c));
        return context.result;
    }

    private parseUpdate(update: any): any {
        const result: any = {};
        const setter_$set: any = update.$set || {};
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

    private parseUpdateFromEntity(entity: TEntity): any {
        // remove entity properties those value were `NaN` or `undefined` since when update by entity they should be ignored
        const update: any = _.cloneDeep<TEntity>(entity) as any;
        for (const key in update) {
            if (update.hasOwnProperty(key)) {
                if (_.isUndefined(update[key]) || _.isNaN(update[key])) {
                    delete update[key];
                }
            }
        }
        return update;
    }

    protected async onUpdate(operationDescription: OperationDescription, condition?: any, update?: any, multi: boolean = false, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        update = this.parseUpdate(update);
        return multi ?
            await this.driver.updateMany(this._collectionName, condition, update, options) :
            await this.driver.updateOne(this._collectionName, condition, update, options);
    }

    public async update(operationDescription: OperationDescription, condition?: any, update?: any, multi: boolean = false, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        const context = new UpdatePluginContext<TSession>(operationDescription, this._driverProvider.name, this._collectionName, condition, update, options);
        await this.processPluginBeforeActions<UpdateResult, UpdatePluginContext<TSession>>(context, (p, c) => p.beforeUpdate(c));

        if (!context.cancel) {
            context.result = await this.onUpdate(operationDescription, context.condition, context.update, multi, context.options);
        }

        await this.processPluginAfterActions<UpdateResult, UpdatePluginContext<TSession>>(context, (p, c) => p.afterUpdate(c));
        return context.result;
    }

    public async updateById(operationDescription: OperationDescription, id: Id, condition?: any, update?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        const context = new UpdateByIdPluginContext<TSession>(operationDescription, this._driverProvider.name, this._collectionName, id, condition, update, options);
        await this.processPluginBeforeActions<UpdateResult, UpdateByIdPluginContext<TSession>>(context, (p, c) => p.beforeUpdateById(c));

        if (!context.cancel) {
            context.result = await this.onUpdate(operationDescription, _.assign({}, context.condition, {
                _id: context.id
            }), context.update, false, context.options);
        }

        await this.processPluginAfterActions<UpdateResult, UpdateByIdPluginContext<TSession>>(context, (p, c) => p.afterUpdateById(c));
        return context.result;
    }

    public async updateByIds(operationDescription: OperationDescription, ids: Id[], condition?: any, update?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        const context = new UpdateByIdsPluginContext<TSession>(operationDescription, this._driverProvider.name, this._collectionName, ids, condition, update, options);
        await this.processPluginBeforeActions<UpdateResult, UpdateByIdsPluginContext<TSession>>(context, (p, c) => p.beforeUpdateByIds(c));

        if (!context.cancel) {
            context.result = await this.onUpdate(operationDescription, _.assign({}, context.condition, {
                _id: {
                    $in: context.ids
                }
            }), context.update, true, context.options);
        }

        await this.processPluginAfterActions<UpdateResult, UpdateByIdsPluginContext<TSession>>(context, (p, c) => p.afterUpdateByIds(c));
        return context.result;
    }

    public async updateByEntity(operationDescription: OperationDescription, entity: TEntity, condition?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        const context = new UpdateByEntityPluginContext<TEntity, TSession>(operationDescription, this._driverProvider.name, this._collectionName, entity, condition, options);
        await this.processPluginBeforeActions<UpdateResult, UpdateByEntityPluginContext<TEntity, TSession>>(context, (p, c) => p.beforeUpdateByEntity(c));

        if (!context.cancel) {
            context.result = await this.onUpdate(operationDescription, _.assign(context.condition, {
                _id: context.entity._id
            }), this.parseUpdateFromEntity(context.entity), false, context.options);
        }

        await this.processPluginAfterActions<UpdateResult, UpdateByEntityPluginContext<TEntity, TSession>>(context, (p, c) => p.afterUpdateByEntity(c));
        return context.result;
    }

    protected async onErase(context: ErasePluginContext<TSession>, multi: boolean): Promise<void> {
        context.result = multi ?
            await this.driver.deleteMany(this._collectionName, context.condition, context.options) :
            await this.driver.deleteOne(this._collectionName, context.condition, context.options);
    }

    protected async erase(operationDescription: OperationDescription, condition?: any, multi: boolean = false, options?: DeleteOptions<TSession>): Promise<DeleteResult> {
        const context = new ErasePluginContext<TSession>(operationDescription, this._driverProvider.name, this._collectionName, condition, options);
        await this.processPluginBeforeActions<DeleteResult, ErasePluginContext<TSession>>(context, (p, c) => p.beforeErase(c));

        if (!context.cancel) {
            await this.onErase(context, multi);
        }

        await this.processPluginAfterActions<DeleteResult, ErasePluginContext<TSession>>(context, (p, c) => p.afterErase(c));
        return context.result;
    }

    protected async onFindOneAndUpdate(operationDescription: OperationDescription, condition?: any, update?: any, options?: FindOneAndUpdateOptions<TEntity, TSession>): Promise<Partial<TEntity> | undefined> {
        return await this.driver.findOneAndUpdate<TEntity>(this._collectionName, condition, this.parseUpdate(update), options);
    }

    public async findOneAndUpdate(operationDescription: OperationDescription, condition?: any, update?: any, options?: FindOneAndUpdateOptions<TEntity, TSession>): Promise<Partial<TEntity> | undefined> {
        const context = new FindOneAndUpdatePluginContext<TEntity, TSession>(operationDescription, this._driverProvider.name, this._collectionName, condition, update, options);
        await this.processPluginBeforeActions<Partial<TEntity> | undefined, FindOneAndUpdatePluginContext<TEntity, TSession>>(context, (p, c) => p.beforeFindOneAndUpdate(c));

        if (!context.cancel) {
            context.result = await this.onFindOneAndUpdate(operationDescription, context.condition, this.parseUpdate(context.update), context.options);
        }

        await this.processPluginAfterActions<Partial<TEntity> | undefined, FindOneAndUpdatePluginContext<TEntity, TSession>>(context, (p, c) => p.afterFindOneAndUpdate(c));
        return context.result;
    }

    public async findOneAndUpdateByEntity(operationDescription: OperationDescription, entity: TEntity, condition?: any, options?: FindOneAndUpdateOptions<TEntity, TSession>): Promise<Partial<TEntity> | undefined> {
        const context = new FindOneAndUpdateByEntityPluginContext<TEntity, TSession>(operationDescription, this._driverProvider.name, this._collectionName, entity, condition, options);
        await this.processPluginBeforeActions<Partial<TEntity> | undefined, FindOneAndUpdateByEntityPluginContext<TEntity, TSession>>(context, (p, c) => p.beforeFindOneAndUpdateByEntity(c));

        if (!context.cancel) {
            context.result = await this.onFindOneAndUpdate(operationDescription, _.assign({}, context.condition, {
                _id: context.entity._id
            }), this.parseUpdateFromEntity(context.entity), context.options);
        }

        await this.processPluginAfterActions<Partial<TEntity> | undefined, FindOneAndUpdateByEntityPluginContext<TEntity, TSession>>(context, (p, c) => p.afterFindOneAndUpdateByEntity(c));
        return context.result;
    }

    public initializeBulkOp(operationDescription: OperationDescription, ordered: boolean = false): BulkOperation {
        return this.driver.initializeBulkOp(this._collectionName, ordered);
    }

    public async aggregate<TResult>(operationDescription: OperationDescription, pipeline: any[], options?: AggregateOptions<TSession>): Promise<Partial<TResult>[]> {
        const context = new AggregatePluginContext<TResult, TSession>(operationDescription, this._driverProvider.name, this._collectionName, pipeline, options);
        await this.processPluginBeforeActions<Partial<TResult>[], AggregatePluginContext<TResult, TSession>>(context, (p, c) => p.beforeAggregate(c));

        if (!context.cancel) {
            context.result = await this.driver.aggregate<TResult>(this._collectionName, context.pipeline, context.options);
        }

        await this.processPluginAfterActions<Partial<TResult>[], AggregatePluginContext<TResult, TSession>>(context, (p, c) => p.afterAggregate(c));
        return context.result;
    }

    public async mapReduce<TResult>(operationDescription: OperationDescription, map: Function | string, reduce: Function | string, options?: MapReduceOptions<TSession>): Promise<Partial<TResult>[]> {
        const context = new MapReducePluginContext<TResult, TSession>(operationDescription, this._driverProvider.name, this._collectionName, map, reduce, options);
        await this.processPluginBeforeActions<Partial<TResult>[], MapReducePluginContext<TResult, TSession>>(context, (p, c) => p.beforeMapReduce(c));

        if (!context.cancel) {
            context.result = await this.driver.mapReduce<TResult>(this._collectionName, context.map, context.reduce, context.options);
        }

        await this.processPluginAfterActions<Partial<TResult>[], MapReducePluginContext<TResult, TSession>>(context, (p, c) => p.afterMapReduce(c));
        return context.result;
    }
}

export { Repository, FindByPageIndexResult, FindByPageNextResult };