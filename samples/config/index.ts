import * as _ from "../../src/utilities";

const env = process.env.NODE_ENV || "development";
const defaultConfig = {
    mongodb: {
        url: "",
        dbName: ""
    },
    env: env,
    redisServer: {
        host: "0.0.0.0",
        port: 6379,
        password: ""
    },
    port: 22222
};

const config = _.merge(defaultConfig, require(`./${env}`)[env]);
export { config };
