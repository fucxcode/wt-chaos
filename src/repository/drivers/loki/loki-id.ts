import { Id } from "../../entities/id";
import { ObjectID } from "bson";

class LokiId extends ObjectID implements Id {

    constructor(id?: string | number | ObjectID) {
        super(id);
    }

    public toString(): string {
        return super.toString();
    }

}

export { LokiId };