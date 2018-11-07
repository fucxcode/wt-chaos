"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = __importStar(require("mongodb"));
var is;
(function (is) {
    is[is["yes"] = 1] = "yes";
    is[is["no"] = 0] = "no";
})(is = exports.is || (exports.is = {}));
exports.EMPTY_OBJECT_ID_STR = `000000000000000000000000`;
exports.EMPTY_OBJECT_ID = new mongodb.ObjectId(exports.EMPTY_OBJECT_ID_STR);
exports.ME_UID = "00000000000000000000000000000000";
exports.ME = {
    uid: exports.ME_UID,
    display_name: "我",
    name: "",
    avatar: ""
};
exports.DEFAULT_PAGE_SIZE = 20;
exports.DEFAULT_PAGE_SIZE_LIMIT = 500;
exports.POSITION_STEP = 65536;
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
//# sourceMappingURL=constants.js.map