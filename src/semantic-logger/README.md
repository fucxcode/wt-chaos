-   example:

    ```javascript
    import { Controller } from "./controller";
    import { Provider } from "./provider";
    import { Level } from "./level";
    import { ConsoleReport, MongoReport } from "./reporter";
    import * as mongodb from "mongodb";
    import { MongoDBDriver } from "../../repository";

    interface IEvent {
        opcode: string;
        keyword: string;
        eventId: number;
    }

    const fixedTeamId = 'xxxxxxxxxx';

    const mongoClient = new mongodb.MongoClient("mongodb://localhost:27017", {
        useNewUrlParser: true
    });
    mongoClient.connect(err => {
        if (err) {
            console.error(err);
            process.exit();
        }
        const mongoDriver = new MongoDBDriver(mongoClient, "event-logger");

        const globalCtrl = Controller.create("wt-gate", Level.info, [
            new ConsoleReport({}),
            new MongoReport(mongoDriver, "etw")
        ]);

        class MissionProvider extends Provider<IEvent> {
            constructor() {
                super("mission");
                this.set("opcode", "start")
                    .set("eventId", 1)
                    .register(globalCtrl);
            }

            public async startProjectSuccess<object>(ctx): Promise<any> {
                return this.set("keyword", "success").log(Level.warn, fixedTeamId, {
                    meta: ctx.user.name
                });
            }

            public async startProjectFail<object>(ctx): Promise<any> {
                return this.set("keyword", "fail").log(Level.error, fixedTeamId, {
                    reason: 'auth error',
                    user: ctx.user.name
                });
            }
        }

        const missionProvider = new MissionProvider();
        missionProvider.startProjectSuccess({});
        missionProvider.startProjectFail("auth error");
    });

    mongoClient.on("error", err => {
        console.error(err);
    });
    ```
