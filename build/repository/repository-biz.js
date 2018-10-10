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
    constructor(collectionName, driver, plugins = []) {
        super(collectionName, driver, plugins);
    }
    async onSave(context) {
        if (!context.operationDescription.team) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke onSave when operationDescription.team is nil", undefined, context.operationDescription);
        }
        if (!context.operationDescription.uid) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke onSave when operationDescription.uid is nil", undefined, context.operationDescription);
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
                entity.is_deleted = constants_1.is.no;
                entity.is_archived = constants_1.is.no;
            }
        }
        else {
            context.entityOrArray.team = team;
            context.entityOrArray.created_at = now;
            context.entityOrArray.created_by = uid;
            context.entityOrArray.updated_at = now;
            context.entityOrArray.updated_by = uid;
            context.entityOrArray.is_deleted = constants_1.is.no;
            context.entityOrArray.is_archived = constants_1.is.no;
        }
        await super.onSave(context);
    }
    combineCondition(condition, team, options) {
        const cond = _.assign({}, condition, {
            team: team
        });
        if (!options || !options.includes || options.includes.deleted !== constants_1.is.yes) {
            _.assign(cond, {
                is_deleted: {
                    $ne: constants_1.is.yes
                }
            });
        }
        if (!options || !options.includes || options.includes.archived !== constants_1.is.yes) {
            _.assign(cond, {
                is_archived: {
                    $ne: constants_1.is.yes
                }
            });
        }
        return cond;
    }
    async onCount(context) {
        if (!context.operationDescription.team) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke onCount when operationDescription.team is nil", undefined, context.operationDescription);
        }
        context.condition = this.combineCondition(context.condition, context.operationDescription.team, context.options);
        await super.onCount(context);
    }
    async onFind(operationDescription, condition, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke onFind when operationDescription.team is nil", undefined, operationDescription);
        }
        condition = this.combineCondition(condition, operationDescription.team, options);
        return await super.onFind(operationDescription, condition, options);
    }
    async onUpdate(operationDescription, condition, update, multi = false, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke onUpdate when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke onUpdate when operationDescription.uid is nil", undefined, operationDescription);
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
        return await super.onUpdate(operationDescription, condition, update, multi, options);
    }
    async onErase(context, multi) {
        if (!context.operationDescription.team) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke onErase when operationDescription.team is nil", undefined, context.operationDescription);
        }
        context.condition = _.assign({}, context.condition, {
            team: context.operationDescription.team
        });
        await super.onErase(context, multi);
    }
    async onFindOneAndUpdate(operationDescription, condition, update, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke onFindOneAndUpdate when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke onFindOneAndUpdate when operationDescription.uid is nil", undefined, operationDescription);
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
        return await super.onFindOneAndUpdate(operationDescription, condition, update, options);
    }
    async delete(operationDescription, deletedOp, condition, multi = false, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke delete when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke delete when operationDescription.uid is nil", undefined, operationDescription);
        }
        const team = operationDescription.team;
        const uid = operationDescription.uid;
        const now = moment_1.default().unix();
        condition = _.assign({}, condition, {
            team: team,
            is_deleted: {
                $ne: constants_1.is.yes
            }
        });
        const update = {
            is_deleted: constants_1.is.yes,
            deleted_by: uid,
            deleted_at: now,
            deleted_op: deletedOp,
            updated_by: uid,
            updated_at: now
        };
        return await this.update(operationDescription, condition, update, multi, options);
    }
    async restore(operationDescription, condition, multi = false, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke restore when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke restore when operationDescription.uid is nil", undefined, operationDescription);
        }
        const team = operationDescription.team;
        const uid = operationDescription.uid;
        const now = moment_1.default().unix();
        condition = _.assign({}, condition, {
            team: team,
            is_deleted: constants_1.is.yes
        });
        const update = {
            $set: {
                is_deleted: constants_1.is.no,
                updated_by: uid,
                updated_at: now
            },
            $unset: {
                deleted_by: 1,
                deleted_at: 1,
                deleted_op: 1,
            }
        };
        return await this.update(operationDescription, condition, update, multi, options);
    }
    async archive(operationDescription, archivedOp, condition, multi = false, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke archive when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke archive when operationDescription.uid is nil", undefined, operationDescription);
        }
        const team = operationDescription.team;
        const uid = operationDescription.uid;
        const now = moment_1.default().unix();
        condition = _.assign({}, condition, {
            team: team,
            is_archived: {
                $ne: constants_1.is.yes
            }
        });
        const update = {
            is_archived: constants_1.is.yes,
            archived_by: uid,
            archived_at: now,
            archived_op: archivedOp,
            updated_by: uid,
            updated_at: now
        };
        return await this.update(operationDescription, condition, update, multi, options);
    }
    async unarchive(operationDescription, condition, multi = false, options) {
        if (!operationDescription.team) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke unarchive when operationDescription.team is nil", undefined, operationDescription);
        }
        if (!operationDescription.uid) {
            throw new errors_1.WTError(errors_1.code.invalidInput, "cannot invoke unarchive when operationDescription.uid is nil", undefined, operationDescription);
        }
        const team = operationDescription.team;
        const uid = operationDescription.uid;
        const now = moment_1.default().unix();
        condition = _.assign({}, condition, {
            team: team,
            is_archived: constants_1.is.yes
        });
        const update = {
            $set: {
                is_archived: constants_1.is.no,
                updated_by: uid,
                updated_at: now
            },
            $unset: {
                archived_by: 1,
                archived_at: 1,
                archived_op: 1,
            }
        };
        return await this.update(operationDescription, condition, update, multi, options);
    }
}
exports.BusinessRepository = BusinessRepository;
//# sourceMappingURL=repository-biz.js.map