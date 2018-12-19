import { injectable, inject } from "../../../src/container";
import { UserRepository } from "./user.repository";
import { TeamRepository } from "../team/team.repository";
import { OperationContext } from "../../../src/router/operation-context";
import { UID } from "../../../src/constants";
import * as _ from "../../../src/utilities";
import { WTError, WTCode } from "../../../src";
import { OperationDescription, Id } from "../../../src/repository";
import { UserEntity } from "./user.entity";
import * as uuid from "node-uuid";

@injectable()
export class UserService {

    @inject()
    private _userRepository!: UserRepository;

    @inject()
    private _teamRepository!: TeamRepository;

    public async createUser(operationContext: OperationContext, email: string, password: string): Promise<UID | undefined> {
        if (_.isNilOrWriteSpaces(email)) {
            throw new WTError(WTCode.invalidInput, "user email not specified", undefined, email);
        }
        if (_.isNilOrWriteSpaces(password)) {
            throw new WTError(WTCode.invalidInput, "user password not specified", undefined, password);
        }
        await this._userRepository.validateUsernameExistsByTeam(OperationDescription.from(operationContext), email);

        const entity: UserEntity = {
            uid: uuid.v4(),
            email: email,
            password: password
        };
        operationContext.uid = entity.uid;
        await this._userRepository.insertOne(OperationDescription.from(operationContext), entity);
        await this._teamRepository.updateById(OperationDescription.from(operationContext), operationContext.team as Id, undefined, {
            $inc: {
                n_active_users: 1
            }
        });
        return entity.uid;
    }


}