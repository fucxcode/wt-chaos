import { RouterContext, RouterRequest, resolve, validate } from "../../../src/router";
import * as _ from "../../../src/utilities";
import { WTError, WTCode } from "../../../src/errors";
import { Id } from "../../../src/repository";
import { UID } from "../../../src/constants";
import { SampleOperationContext } from "../../info/sample-operation-context";

export class CreateTeamRequest extends RouterRequest<SampleOperationContext> {

    @resolve(ctx => ctx.requestBody.team_name)
    @validate(async value => {
        if (_.isNilOrWriteSpaces(value)) {
            throw new WTError(WTCode.invalidInput, "team name not specified", undefined, value);
        }
    })
    public teamName!: string;

    @resolve(ctx => ctx.requestBody.admin_name)
    @validate(async value => {
        if (_.isNilOrWriteSpaces(value)) {
            throw new WTError(WTCode.invalidInput, "admin name not specified", undefined, value);
        }
    })
    @validate<SampleOperationContext, CreateTeamRequest, string>(async (value, self) => {
        if (value === self.teamName) {
            throw new WTError(WTCode.invalidInput, "admin name cannot be the same as team name", undefined, {
                admin_name: value,
                team_name: self.teamName
            });
        }
    })
    public adminName!: string;

    @resolve(ctx => ctx.requestBody.admin_pwd)
    @validate(async value => {
        if (_.isNilOrWriteSpaces(value)) {
            throw new WTError(WTCode.invalidInput, "admin password not specified", undefined, value);
        }
    })
    public adminPassword!: string;

}

export class CreateTeamResponse {

    constructor(
        public team_id?: Id,
        public admin_uid?: UID
    ) { }

}