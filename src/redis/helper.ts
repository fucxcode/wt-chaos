import * as _ from "../utilities";

export class RedisHelper {

    public static convertKeyValuePairsToFirstRest(keyValuePairs: [string, any][]): {
        first: [string, any],
        rest: any[]
    } | undefined {
        if (_.some(keyValuePairs)) {
            const first = _.first(keyValuePairs) as [string, any];
            const rest = _.chain(keyValuePairs)
                .tail()
                .map(x => [x["0"], x["1"]])
                .flatten()
                .valueOf();
            return {
                first: first,
                rest: rest
            };
        }
    }

}