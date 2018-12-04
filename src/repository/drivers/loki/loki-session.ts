import { Session } from "../session";
import * as uuid from "node-uuid";

class LokiSession implements Session {

    public get id(): string {
        throw new Error("not implements");
    }

    public inTransaction(): boolean {
        throw new Error("not implements");
    }

}

export { LokiSession };