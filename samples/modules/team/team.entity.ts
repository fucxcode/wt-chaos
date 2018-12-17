import { Entity, collectionName, defaultValue } from "../../../src/repository";

@collectionName("teams")
export class TeamEntity extends Entity {

    name?: string;

    @defaultValue<number>(() => 0)
    n_active_users?: number;

}