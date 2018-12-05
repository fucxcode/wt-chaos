import * as mongodb from "mongodb";
import { Id } from "../../entities/id";

class MongoDBId extends mongodb.ObjectId implements Id {

    constructor(id?: string | number | mongodb.ObjectId) {
        super(id);
    }

    public toString(): string {
        return super.toString();
    }

    public equals(other: MongoDBId): boolean {
        return this.toString() === other.toString();
    }

}

export { MongoDBId };