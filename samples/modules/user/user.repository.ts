import { MongoDBBusinessRepository } from "../../core/mongodb-repository-biz";
import { UserEntity } from "./user.entity";
import { injectable } from "../../../src/container";
import { OperationDescription } from "../../../src/repository";
import { WTError, WTCode } from "../../../src";

@injectable()
export class UserRepository extends MongoDBBusinessRepository<UserEntity> {

    constructor() {
        super(UserEntity);
    }

    public async validateUsernameExistsByTeam(operationDescription: OperationDescription, name: string): Promise<void> {
        const count = await this.count(operationDescription, {
            name: name
        });
        if (count > 0) {
            throw new WTError(WTCode.invalidInput, "duplicated user name in team", undefined, {
                name: name,
                team: operationDescription.team
            });
        }
    }

}