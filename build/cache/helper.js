"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../utilities"));
class CacheHelper {
    static convertKeyValuePairsToFirstRest(keyValuePairs) {
        if (_.some(keyValuePairs)) {
            const first = _.first(keyValuePairs);
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
exports.CacheHelper = CacheHelper;
//# sourceMappingURL=helper.js.map