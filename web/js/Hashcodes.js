"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base58check = require("base58check");
const Preconditions_1 = require("./Preconditions");
const js_sha3_1 = require("js-sha3");
class Hashcodes {
    static create(data) {
        Preconditions_1.Preconditions.assertNotNull(data, "data");
        return base58check.encode(js_sha3_1.keccak256(data));
    }
    static createID(obj, len = 10) {
        let id = Hashcodes.create(JSON.stringify(obj));
        return id.substring(0, len);
    }
}
exports.Hashcodes = Hashcodes;
;
//# sourceMappingURL=Hashcodes.js.map