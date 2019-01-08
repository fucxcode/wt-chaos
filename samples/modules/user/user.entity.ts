import { BusinessEntity, collectionName, defaultValue, indexes } from "../../../src/repository";
import * as uuid from "node-uuid";
import { Direction, UID } from "../../../src/constants";

@collectionName("users")
@indexes<UserEntity>([
    {
        uid: Direction.ascending
    }
])
export class UserEntity extends BusinessEntity {

    @defaultValue(() => uuid.v4())
    uid?: UID;

    email?: string;

    password?: string;

}