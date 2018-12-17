import { MongoDBRepository } from "../../core/mongodb-repository";
import { TeamEntity } from "./team.entity";
import { injectable } from "../../../src/container";

@injectable()
export class TeamRepository extends MongoDBRepository<TeamEntity> {

    constructor() {
        super(TeamEntity);
    }

}