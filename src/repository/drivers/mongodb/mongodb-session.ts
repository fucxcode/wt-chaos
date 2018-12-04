import * as mongodb from "mongodb";
import { Session } from "../session";

class MongoDBSession implements Session {

    private _session: mongodb.ClientSession;
    public get session(): mongodb.ClientSession {
        return this._session;
    }

    public get id(): any {
        return this._session.id;
    }

    constructor(session: mongodb.ClientSession) {
        this._session = session;
    }

    public inTransaction(): boolean {
        return this._session.inTransaction();
    }

}

export { MongoDBSession };