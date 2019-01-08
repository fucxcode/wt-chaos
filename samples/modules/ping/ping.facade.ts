import { facade, get } from "../../../src/facade";
import { inject } from "../../../src/container";
import { PingService } from "./ping.service";
import { RouterContext, OperationContext } from "../../../src/router";

@facade()
export class PingFacade {

    @inject()
    private _pingService!: PingService;

    @get("/ping")
    public async ping(ctx: RouterContext<OperationContext>): Promise<string> {
        return await this._pingService.ping();
    }

}