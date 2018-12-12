import { Entity, Repository, MongoDBSession, MongoDBId, MongoDBDriver } from "../../src/repository";

export abstract class MongoDBRepository<TEntity extends Entity> extends Repository<MongoDBSession, MongoDBId, MongoDBDriver, TEntity> {

    constructor(EntityType: Function) {
        super(EntityType);
    }

}