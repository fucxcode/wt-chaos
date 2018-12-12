import { facade, get } from "../../../src/facade";
import { inject } from "../../../src/container";
import { PingService } from "./ping.service";

@facade()
export class PingFacade {

    @inject()
    private _pingService!: PingService;

    @get("/ping")
    public async ping(): Promise<string> {
        return await this._pingService.ping();
    }

}