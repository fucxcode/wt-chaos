import { injectable } from "../../../src/container";

@injectable()
export class PingService {

    public async ping(): Promise<string> {
        return "PONG!";
    }

}