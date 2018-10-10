import { Session, Driver, FindOptions, UpdateOptions, UpdateResult, FindOneAndUpdateOptions } from "./drivers";
import { Repository } from "./repository";
import { BusinessEntity, Id } from "./entities";
import { Plugin, SavePluginContext, CountPluginContext, ErasePluginContext } from "./plugins";
import { OperationDescription } from "./operation-desc";
declare abstract class BusinessRepository<TSession extends Session, TID extends Id, TDriver extends Driver<TSession, TID>, TEntity extends BusinessEntity> extends Repository<TSession, TID, TDriver, TEntity> {
    constructor(collectionName: string, driver: TDriver, plugins?: Plugin[]);
    protected onSave(context: SavePluginContext<TEntity, TSession>): Promise<void>;
    private combineCondition;
    protected onCount(context: CountPluginContext<TSession>): Promise<void>;
    protected onFind(operationDescription: OperationDescription, condition?: any, options?: FindOptions<TEntity, TSession>): Promise<Partial<TEntity>[]>;
    protected onUpdate(operationDescription: OperationDescription, condition?: any, update?: any, multi?: boolean, options?: UpdateOptions<TSession>): Promise<UpdateResult>;
    protected onErase(context: ErasePluginContext<TSession>, multi: boolean): Promise<void>;
    protected onFindOneAndUpdate(operationDescription: OperationDescription, condition?: any, update?: any, options?: FindOneAndUpdateOptions<TEntity, TSession>): Promise<Partial<TEntity> | undefined>;
    delete(operationDescription: OperationDescription, deletedOp: number, condition?: any, multi?: boolean, options?: UpdateOptions<TSession>): Promise<UpdateResult>;
    restore(operationDescription: OperationDescription, condition?: any, multi?: boolean, options?: UpdateOptions<TSession>): Promise<UpdateResult>;
    archive(operationDescription: OperationDescription, archivedOp: number, condition?: any, multi?: boolean, options?: UpdateOptions<TSession>): Promise<UpdateResult>;
    unarchive(operationDescription: OperationDescription, condition?: any, multi?: boolean, options?: UpdateOptions<TSession>): Promise<UpdateResult>;
}
export { BusinessRepository };
