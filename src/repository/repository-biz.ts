import { Session, Driver, FindOptions, UpdateOptions, UpdateResult, FindOneAndUpdateOptions } from "./drivers";
import { Repository } from "./repository";
import { BusinessEntity, Id } from "./entities";
import { Plugin, SavePluginContext, CountPluginContext, ErasePluginContext } from "./plugins";
import * as _ from "../utilities";
import { WTError, WTCode } from "../errors";
import moment from "moment";
import { OperationDescription } from "./operation-desc";
import { Is, UID } from "../constants";
import { IncludesOptions } from "./drivers/includes-options";

abstract class BusinessRepository<TSession extends Session, TID extends Id, TDriver extends Driver<TSession, TID>, TEntity extends BusinessEntity> extends Repository<TSession, TID, TDriver, TEntity> {

    constructor(collectionName: string, driver: TDriver, plugins: Plugin[] = []) {
        super(collectionName, driver, plugins);
    }

    protected async onSave(context: SavePluginContext<TEntity, TSession>): Promise<void> {
        if (!context.operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke onSave when operationDescription.team is nil", undefined, context.operationDescription);
        }
        if (!context.operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke onSave when operationDescription.uid is nil", undefined, context.operationDescription);
        }

        const team = context.operationDescription.team;
        const uid = context.operationDescription.uid;
        const now = moment().unix();
        if (_.isArray(context.entityOrArray)) {
            for (const entity of context.entityOrArray) {
                entity.team = team;
                entity.created_at = now;
                entity.created_by = uid;
                entity.updated_at = now;
                entity.updated_by = uid;
                entity.is_deleted = Is.no;
                entity.is_archived = Is.no;
            }
        }
        else {
            context.entityOrArray.team = team;
            context.entityOrArray.created_at = now;
            context.entityOrArray.created_by = uid;
            context.entityOrArray.updated_at = now;
            context.entityOrArray.updated_by = uid;
            context.entityOrArray.is_deleted = Is.no;
            context.entityOrArray.is_archived = Is.no;
        }
        await super.onSave(context);
    }

    private combineCondition(condition: any, team: Id, options?: IncludesOptions): any {
        const cond = _.assign({}, condition, {
            team: team
        });

        if (!options || !options.includes || options.includes.deleted !== Is.yes) {
            _.assign(cond, {
                is_deleted: {
                    $ne: Is.yes
                }
            });
        }
        if (!options || !options.includes || options.includes.archived !== Is.yes) {
            _.assign(cond, {
                is_archived: {
                    $ne: Is.yes
                }
            });
        }

        return cond;
    }
    
    protected async onCount(context: CountPluginContext<TSession>): Promise<void> {
        if (!context.operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke onCount when operationDescription.team is nil", undefined, context.operationDescription);
        }

        context.condition = this.combineCondition(context.condition, context.operationDescription.team, context.options);
        await super.onCount(context);
    }
    
    protected async onFind(operationDescription: OperationDescription, condition?: any, options?: FindOptions<TEntity, TSession>): Promise<Partial<TEntity>[]> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke onFind when operationDescription.team is nil", undefined, operationDescription);
        }

        condition = this.combineCondition(condition, operationDescription.team, options);
        return await super.onFind(operationDescription, condition, options);
    }

    private removeTeamPropertyInUpdate(update: any): void {
        if (update.team) {
            delete update.team;
        }
        if (update.$set && update.$set.team) {
            delete update.$set.team;
        }
        if (update.$unset && update.$unset.team) {
            delete update.$unset.team;
        }
    }
    
    protected async onUpdate(operationDescription: OperationDescription, condition?: any, update?: any, multi: boolean = false, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke onUpdate when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke onUpdate when operationDescription.uid is nil", undefined, operationDescription);
        }

        const team = operationDescription.team;
        const uid = operationDescription.uid;
        const now = moment().unix();
        condition = _.assign({}, condition, {
            team: team
        });
        update = _.assign({}, update, {
            updated_at: now,
            updated_by: uid
        });
        this.removeTeamPropertyInUpdate(update);

        return await super.onUpdate(operationDescription, condition, update, multi, options);
    }
    
    protected async onErase(context: ErasePluginContext<TSession>, multi: boolean): Promise<void> {
        if (!context.operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke onErase when operationDescription.team is nil", undefined, context.operationDescription);
        }

        context.condition = _.assign({}, context.condition, {
            team: context.operationDescription.team
        });
        await super.onErase(context, multi);
    }
    
    protected async onFindOneAndUpdate(operationDescription: OperationDescription, condition?: any, update?: any, options?: FindOneAndUpdateOptions<TEntity, TSession>): Promise<Partial<TEntity> | undefined> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke onFindOneAndUpdate when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke onFindOneAndUpdate when operationDescription.uid is nil", undefined, operationDescription);
        }

        const team = operationDescription.team;
        const uid = operationDescription.uid;
        const now = moment().unix();
        condition = _.assign({}, condition, {
            team: team
        });
        update = _.assign({}, update, {
            updated_at: now,
            updated_by: uid
        });
        this.removeTeamPropertyInUpdate(update);

        return await super.onFindOneAndUpdate(operationDescription, condition, update, options);
    }

    private getDeleteConditionAndUpdate(team: Id, uid: UID, deletedOp: number, condition?: any): {
        c: any,
        u: any
    } {
        const now = moment().unix();
        return {
            c: _.assign({}, condition, {
                team: team,
                is_deleted: {
                    $ne: Is.yes
                }
            }),
            u: {
                is_deleted: Is.yes,
                deleted_by: uid,
                deleted_at: now,
                deleted_op: deletedOp,
                updated_by: uid,
                updated_at: now
            }
        };
    }
    
    public async delete(operationDescription: OperationDescription, deletedOp: number, condition?: any, multi: boolean = false, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke delete when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke delete when operationDescription.uid is nil", undefined, operationDescription);
        }

        const { c, u } = this.getDeleteConditionAndUpdate(operationDescription.team, operationDescription.uid, deletedOp, condition);
        return await this.update(operationDescription, c, u, multi, options);
    }

    public async deleteById(operationDescription: OperationDescription, id: Id, deletedOp: number, condition?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke deleteById when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke deleteById when operationDescription.uid is nil", undefined, operationDescription);
        }

        const { c, u } = this.getDeleteConditionAndUpdate(operationDescription.team, operationDescription.uid, deletedOp, condition);
        return await this.updateById(operationDescription, id, c, u, options);
    }

    public async deleteByIds(operationDescription: OperationDescription, ids: Id[], deletedOp: number, condition?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke deleteById when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke deleteById when operationDescription.uid is nil", undefined, operationDescription);
        }

        const { c, u } = this.getDeleteConditionAndUpdate(operationDescription.team, operationDescription.uid, deletedOp, condition);
        return await this.updateByIds(operationDescription, ids, c, u, options);
    }

    private getRestoreConditionAndUpdate(team: Id, uid: UID, condition?: any): {
        c: any,
        u: any
    } {
        const now = moment().unix();
        return {
            c: _.assign({}, condition, {
                team: team,
                is_deleted: Is.yes
            }),
            u: {
                $set: {
                    is_deleted: Is.no,
                    updated_by: uid,
                    updated_at: now
                },
                $unset: {
                    deleted_by: 1,
                    deleted_at: 1,
                    deleted_op: 1,
                }
            }
        };
    }

    public async restore(operationDescription: OperationDescription, condition?: any, multi: boolean = false, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke restore when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke restore when operationDescription.uid is nil", undefined, operationDescription);
        }

        const { c, u } = this.getRestoreConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);

        return await this.update(operationDescription, c, u, multi, options);
    }

    public async restoreById(operationDescription: OperationDescription, id: Id, condition?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke restoreById when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke restoreById when operationDescription.uid is nil", undefined, operationDescription);
        }

        const { c, u } = this.getRestoreConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.updateById(operationDescription, id, c, u, options);
    }

    public async restoreByIds(operationDescription: OperationDescription, ids: Id[], condition?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke restoreByIds when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke restoreByIds when operationDescription.uid is nil", undefined, operationDescription);
        }

        const { c, u } = this.getRestoreConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.updateById(operationDescription, ids, c, u, options);
    }

    private getArchiveConditionAndUpdate(team: Id, uid: UID, archivedOp: number, condition?: any): {
        c: any,
        u: any
    } {
        const now = moment().unix();
        return {
            c: _.assign({}, condition, {
                team: team,
                is_archived: {
                    $ne: Is.yes
                }
            }),
            u: {
                is_archived: Is.yes,
                archived_by: uid,
                archived_at: now,
                archived_op: archivedOp,
                updated_by: uid,
                updated_at: now
            }
        };
    }

    public async archive(operationDescription: OperationDescription, archivedOp: number, condition?: any, multi: boolean = false, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke archive when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke archive when operationDescription.uid is nil", undefined, operationDescription);
        }

        const { c, u } = this.getArchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, archivedOp, condition);
        return await this.update(operationDescription, c, u, multi, options);
    }

    public async archiveById(operationDescription: OperationDescription, id: Id, archivedOp: number, condition?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke archiveById when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke archiveById when operationDescription.uid is nil", undefined, operationDescription);
        }

        const { c, u } = this.getArchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, archivedOp, condition);
        return await this.updateById(operationDescription, id, c, u, options);
    }

    public async archiveByIds(operationDescription: OperationDescription, ids: Id[], archivedOp: number, condition?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke archiveByIds when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke archiveByIds when operationDescription.uid is nil", undefined, operationDescription);
        }

        const { c, u } = this.getArchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, archivedOp, condition);
        return await this.updateByIds(operationDescription, ids, c, u, options);
    }

    private getUnarchiveConditionAndUpdate(team: Id, uid: UID, condition?: any): {
        c: any,
        u: any
    } {
        const now = moment().unix();
        return {
            c: _.assign({}, condition, {
                team: team,
                is_archived: Is.yes
            }),
            u: {
                $set: {
                    is_archived: Is.no,
                    updated_by: uid,
                    updated_at: now
                },
                $unset: {
                    archived_by: 1,
                    archived_at: 1,
                    archived_op: 1,
                }
            }
        };
    }

    public async unarchive(operationDescription: OperationDescription, condition?: any, multi: boolean = false, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke unarchive when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke unarchive when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getUnarchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.update(operationDescription, c, u, multi, options);
    }

    public async unarchiveById(operationDescription: OperationDescription, id: Id, condition?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke unarchiveById when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke unarchiveById when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getUnarchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.updateById(operationDescription, id, c, u, options);
    }

    public async unarchiveByIds(operationDescription: OperationDescription, ids: Id[], condition?: any, options?: UpdateOptions<TSession>): Promise<UpdateResult> {
        if (!operationDescription.team) {
            throw new WTError(WTCode.invalidInput, "cannot invoke unarchiveByIds when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new WTError(WTCode.invalidInput, "cannot invoke unarchiveByIds when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getUnarchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.updateByIds(operationDescription, ids, c, u, options);
    }
}

export { BusinessRepository };