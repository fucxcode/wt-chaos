# event-logger

## example

```javascript
import { Controller } from "./controller";
import { Provider } from "./logger";
import { Level } from "./entity";
import { ConsoleReport, MongoReport } from "./report";
import * as mongodb from "mongodb";
import { MongoDBDriver } from "../../repository";

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

    class MissionProvider extends Provider {
        constructor() {
            super("mission");
            this.set("opCode", "start").register(globalCtrl);
        }

        public async startProjectSuccess(msg: string): Promise<any> {
            return this.set("keyword", "success").log(Level.warn, msg);
        }

        public async startProjectFail(msg: string): Promise<any> {
            return this.set("keyword", "fail").log(Level.error, msg);
        }
    }

    const missonProvider = new MissionProvider();
    missonProvider.startProjectSuccess("haha").then(result => {
        console.log("haha result ===>", result);
    });
    missonProvider.startProjectFail("auth error").then(result => {
        console.log("auth error result", result);
    });
});

mongoClient.on("error", err => {
    console.error(err);
});
```
