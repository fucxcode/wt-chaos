import { Entity } from "./entity";
import { Id } from "./id";
import { Timestamp, UID, Is } from "../../constants";
import { defaultValue } from "../decorators";
import moment from "moment";

export abstract class BusinessEntity extends Entity {

    @defaultValue(operationDescription => operationDescription.team)
    team?: Id;

    @defaultValue(() => moment().unix())
    created_at?: Timestamp;

    @defaultValue(operationDescription => operationDescription.uid)
    created_by?: UID;

    @defaultValue(() => moment().unix())
    updated_at?: Timestamp;

    @defaultValue(operationDescription => operationDescription.uid)
    updated_by?: UID;

    @defaultValue(() => Is.no)
    is_deleted?: Is;

    deleted_at?: Timestamp;

    deleted_by?: UID;

    deleted_op?: number;

    @defaultValue(() => Is.no)
    is_archived?: Is;

    archived_at?: Timestamp;

    archived_by?: UID;

    archived_op?: number;
    
}