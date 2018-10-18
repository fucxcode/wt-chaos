export declare class RedisHelper {
    static convertKeyValuePairsToFirstRest(keyValuePairs: [string, any][]): {
        first: [string, any];
        rest: any[];
    } | undefined;
}
