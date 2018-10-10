import { Session } from "./session";
interface SessionOptions<TSession extends Session> {
    session?: TSession;
}
export { SessionOptions };
