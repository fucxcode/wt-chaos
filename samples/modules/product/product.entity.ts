import { Entity, defaultValue, collectionName } from "../../../src/repository";
import { Timestamp } from "bson";
import { UID, Is } from "../../../src/constants";

@collectionName("products")
export class ProductEntity extends Entity {

    name?: string;

    @defaultValue(() => Is.no)
    is_deleted?: Is;

    @defaultValue(() => Date.now())
    created_at?: Timestamp;

    @defaultValue(() => Date.now())
    updated_at?: Timestamp;

}