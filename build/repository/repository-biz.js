"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("./repository");
const _ = __importStar(require("../utilities"));
const errors_1 = require("../errors");
const moment_1 = __importDefault(require("moment"));
const constants_1 = require("../constants");
class BusinessRepository extends repository_1.Repository {
    constructor(collectionName, driverProvider, plugins) {
        super(collectionName, driverProvider, plugins);
    }
    async onSave(context) {
        if (!context.operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke onSave when operationDescription.team is nil", undefined, context.operationDescription);
        }
        if (!context.operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke onSave when operationDescription.uid is nil", undefined, context.operationDescription);
        }
        const team = context.operationDescription.team;
        const uid = context.operationDescription.uid;
        const now = moment_1.default().unix();
        if (_.isArray(context.entityOrArray)) {
            for (const entity of context.entityOrArray) {
                entity.team = team;
                entity.created_at = now;
                entity.created_by = uid;
                entity.updated_at = now;
                entity.updated_by = uid;
                entity.is_deleted = constants_1.Is.no;
                entity.is_archived = constants_1.Is.no;
            }
        }
        else {
            context.entityOrArray.team = team;
            context.entityOrArray.created_at = now;
            context.entityOrArray.created_by = uid;
            context.entityOrArray.updated_at = now;
            context.entityOrArray.updated_by = uid;
            context.entityOrArray.is_deleted = constants_1.Is.no;
            context.entityOrArray.is_archived = constants_1.Is.no;
        }
        await super.onSave(context);
    }
    combineCondition(condition, team, options) {
        const cond = _.assign({}, condition, {
            team: team
        });
        if (!options || !options.includes || options.includes.deleted !== constants_1.Is.yes) {
            _.assign(cond, {
                is_deleted: {
                    $ne: constants_1.Is.yes
                }
            });
        }
        if (!options || !options.includes || options.includes.archived !== constants_1.Is.yes) {
            _.assign(cond, {
                is_archived: {
                    $ne: constants_1.Is.yes
                }
            });
        }
        return cond;
    }
    async onCount(context) {
        if (!context.operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke onCount when operationDescription.team is nil", undefined, context.operationDescription);
        }
        context.condition = this.combineCondition(context.condition, context.operationDescription.team, context.options);
        await super.onCount(context);
    }
    async onFind(operationDescription, condition, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke onFind when operationDescription.team is nil", undefined, operationDescription);
        }
        condition = this.combineCondition(condition, operationDescription.team, options);
        return await super.onFind(operationDescription, condition, options);
    }
    removeTeamPropertyInUpdate(update) {
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
    async onUpdate(operationDescription, condition, update, multi = false, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke onUpdate when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke onUpdate when operationDescription.uid is nil", undefined, operationDescription);
        }
        const team = operationDescription.team;
        const uid = operationDescription.uid;
        const now = moment_1.default().unix();
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
    async onErase(context, multi) {
        if (!context.operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke onErase when operationDescription.team is nil", undefined, context.operationDescription);
        }
        context.condition = _.assign({}, context.condition, {
            team: context.operationDescription.team
        });
        await super.onErase(context, multi);
    }
    async onFindOneAndUpdate(operationDescription, condition, update, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke onFindOneAndUpdate when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke onFindOneAndUpdate when operationDescription.uid is nil", undefined, operationDescription);
        }
        const team = operationDescription.team;
        const uid = operationDescription.uid;
        const now = moment_1.default().unix();
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
    getDeleteConditionAndUpdate(team, uid, deletedOp, condition) {
        const now = moment_1.default().unix();
        return {
            c: _.assign({}, condition, {
                team: team,
                is_deleted: {
                    $ne: constants_1.Is.yes
                }
            }),
            u: {
                is_deleted: constants_1.Is.yes,
                deleted_by: uid,
                deleted_at: now,
                deleted_op: deletedOp,
                updated_by: uid,
                updated_at: now
            }
        };
    }
    async delete(operationDescription, deletedOp, condition, multi = false, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke delete when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke delete when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getDeleteConditionAndUpdate(operationDescription.team, operationDescription.uid, deletedOp, condition);
        return await this.update(operationDescription, c, u, multi, options);
    }
    async deleteById(operationDescription, id, deletedOp, condition, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke deleteById when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke deleteById when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getDeleteConditionAndUpdate(operationDescription.team, operationDescription.uid, deletedOp, condition);
        return await this.updateById(operationDescription, id, c, u, options);
    }
    async deleteByIds(operationDescription, ids, deletedOp, condition, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke deleteById when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke deleteById when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getDeleteConditionAndUpdate(operationDescription.team, operationDescription.uid, deletedOp, condition);
        return await this.updateByIds(operationDescription, ids, c, u, options);
    }
    getRestoreConditionAndUpdate(team, uid, condition) {
        const now = moment_1.default().unix();
        return {
            c: _.assign({}, condition, {
                team: team,
                is_deleted: constants_1.Is.yes
            }),
            u: {
                $set: {
                    is_deleted: constants_1.Is.no,
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
    async restore(operationDescription, condition, multi = false, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke restore when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke restore when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getRestoreConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.update(operationDescription, c, u, multi, options);
    }
    async restoreById(operationDescription, id, condition, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke restoreById when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke restoreById when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getRestoreConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.updateById(operationDescription, id, c, u, options);
    }
    async restoreByIds(operationDescription, ids, condition, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke restoreByIds when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke restoreByIds when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getRestoreConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.updateById(operationDescription, ids, c, u, options);
    }
    getArchiveConditionAndUpdate(team, uid, archivedOp, condition) {
        const now = moment_1.default().unix();
        return {
            c: _.assign({}, condition, {
                team: team,
                is_archived: {
                    $ne: constants_1.Is.yes
                }
            }),
            u: {
                is_archived: constants_1.Is.yes,
                archived_by: uid,
                archived_at: now,
                archived_op: archivedOp,
                updated_by: uid,
                updated_at: now
            }
        };
    }
    async archive(operationDescription, archivedOp, condition, multi = false, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke archive when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke archive when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getArchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, archivedOp, condition);
        return await this.update(operationDescription, c, u, multi, options);
    }
    async archiveById(operationDescription, id, archivedOp, condition, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke archiveById when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke archiveById when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getArchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, archivedOp, condition);
        return await this.updateById(operationDescription, id, c, u, options);
    }
    async archiveByIds(operationDescription, ids, archivedOp, condition, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke archiveByIds when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke archiveByIds when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getArchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, archivedOp, condition);
        return await this.updateByIds(operationDescription, ids, c, u, options);
    }
    getUnarchiveConditionAndUpdate(team, uid, condition) {
        const now = moment_1.default().unix();
        return {
            c: _.assign({}, condition, {
                team: team,
                is_archived: constants_1.Is.yes
            }),
            u: {
                $set: {
                    is_archived: constants_1.Is.no,
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
    async unarchive(operationDescription, condition, multi = false, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke unarchive when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke unarchive when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getUnarchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.update(operationDescription, c, u, multi, options);
    }
    async unarchiveById(operationDescription, id, condition, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke unarchiveById when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke unarchiveById when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getUnarchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.updateById(operationDescription, id, c, u, options);
    }
    async unarchiveByIds(operationDescription, ids, condition, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke unarchiveByIds when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.WTCode.invalidInput, "cannot invoke unarchiveByIds when operationDescription.uid is nil", undefined, operationDescription);
        }
        const { c, u } = this.getUnarchiveConditionAndUpdate(operationDescription.team, operationDescription.uid, condition);
        return await this.updateByIds(operationDescription, ids, c, u, options);
    }
}
exports.BusinessRepository = BusinessRepository;
//# sourceMappingURL=repository-biz.js.map