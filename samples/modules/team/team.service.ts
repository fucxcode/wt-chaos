import { injectable, inject } from "../../../src/container";
import { TeamRepository } from "./team.repository";
import { OperationContext } from "../../../src/router/operation-context";
import { Id, OperationDescription } from "../../../src/repository";
import * as _ from "../../../src/utilities";
import { WTError, WTCode } from "../../../src";
import { TeamEntity } from "./team.entity";
import { CreateTeamRequest, CreateTeamResponse } from "./team.info";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { UID } from "../../../src/constants";

@injectable()
export class TeamService {

    @inject()
    private _teamRepository!: TeamRepository;

    @inject()
    private _userService!: UserService;

    public async createTeam(request: CreateTeamRequest): Promise<CreateTeamResponse> {
        const team: TeamEntity = {
            name: request.teamName
        };
        await this._teamRepository.insertOne(request.operationDescription, team);

        // assign team id into operation context since the user service invokes user repository with this property in used
        request.operationContext.team = team._id;
        const uid = await this._userService.createUser(request.operationContext, request.adminName, request.adminPassword);
        return new CreateTeamResponse(team._id, uid);
    }

}