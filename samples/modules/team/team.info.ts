import { RouterContext, RouterRequest } from "../../../src/router";
import * as _ from "../../../src/utilities";
import { WTError, WTCode } from "../../../src/errors";
import { Id } from "../../../src/repository";
import { UID } from "../../../src/constants";
import { SampleOperationContext } from "../../info/sample-operation-context";

export class CreateTeamRequest extends RouterRequest<SampleOperationContext> {

    public teamName!: string;

    public adminName!: string;

    public adminPassword!: string;

    constructor(ctx?: RouterContext<SampleOperationContext>) {
        super(ctx);

        if (ctx && ctx.requestBody) {
            this.teamName = ctx.requestBody.team_name;
            this.adminName = ctx.requestBody.admin_name;
            this.adminPassword = ctx.requestBody.admin_pwd;

            if (_.isNilOrWriteSpaces(this.teamName)) {
                throw new WTError(WTCode.invalidInput, "team name not specified", undefined, this.teamName);
            }
            if (_.isNilOrWriteSpaces(this.adminName)) {
                throw new WTError(WTCode.invalidInput, "admin name not specified", undefined, this.adminName);
            }
            if (_.isNilOrWriteSpaces(this.adminPassword)) {
                throw new WTError(WTCode.invalidInput, "admin password not specified", undefined, this.adminPassword);
            }
        }
    }

}

export class CreateTeamResponse {

    constructor(
        public team_id?: Id,
        public admin_uid?: UID
    ) { }

}