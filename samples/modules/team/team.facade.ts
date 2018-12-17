import { facade, route, post } from "../../../src/facade";
import { inject } from "../../../src/container";
import { TeamService } from "./team.service";
import { OperationContext } from "../../../src/router/operation-context";
import { RouterContext } from "../../../src/router";
import { Id } from "../../../src/repository";
import { CreateTeamRequest, CreateTeamResponse } from "./team.info";

@facade()
export class TeamFacade {

    @inject()
    private _teamService!: TeamService;

    @post("/team", CreateTeamRequest)
    public async createTeam(req: CreateTeamRequest): Promise<CreateTeamResponse> {
        return await this._teamService.createTeam(req);
    }

}