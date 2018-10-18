import { Entity } from "./entity";
import { Id } from "./id";
import { Timestamp, UID, is } from "../../constants";
export interface BusinessEntity extends Entity {
    team?: Id;
    created_at?: Timestamp;
    created_by?: UID;
    updated_at?: Timestamp;
    updated_by?: UID;
    is_deleted?: is;
    deleted_at?: Timestamp;
    deleted_by?: UID;
    deleted_op?: number;
    is_archived?: is;
    archived_at?: Timestamp;
    archived_by?: UID;
    archived_op?: number;
}
