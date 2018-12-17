import { MongoDBSession, MongoDBId, MongoDBDriver, BusinessRepository, BusinessEntity } from "../../src/repository";

export abstract class MongoDBBusinessRepository<TEntity extends BusinessEntity> extends BusinessRepository<MongoDBSession, MongoDBId, MongoDBDriver, TEntity> {

    constructor(EntityType: Function) {
        super(EntityType);
    }

}