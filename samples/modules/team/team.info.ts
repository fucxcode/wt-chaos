import { RouterContext, RouterRequest, resolve, validate, required, equals, body, length, regex } from "../../../src/router";
import * as _ from "../../../src/utilities";
import { WTError, WTCode } from "../../../src/errors";
import { Id } from "../../../src/repository";
import { UID } from "../../../src/constants";
import { SampleOperationContext } from "../../info/sample-operation-context";

export class CreateTeamRequest extends RouterRequest<SampleOperationContext> {

    @body("team_name")
    @required()
    @length(3, 10)
    public teamName!: string;

    @body("admin_email")
    @required()
    @regex(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
    public adminEmail!: string;

    @body("admin_pwd")
    @required()
    public adminPassword!: string;

    @body("admin_pwd_repeat")
    @required()
    @equals<SampleOperationContext, CreateTeamRequest, string>(req => req.adminPassword)
    public adminPasswordRepeat!: string;

}

export class CreateTeamResponse {

    constructor(
        public team_id?: Id,
        public admin_uid?: UID
    ) { }

}