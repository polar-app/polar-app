"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDs = void 0;
const Sequences_1 = require("../util/Sequences");
var UUIDs;
(function (UUIDs) {
    function create() {
        return Sequences_1.Sequences.create();
    }
    UUIDs.create = create;
    function parse(sequence) {
        return Sequences_1.Sequences.parse(sequence);
    }
    UUIDs.parse = parse;
    function toNonce(sequence) {
        var _a;
        return (_a = parse(sequence)) === null || _a === void 0 ? void 0 : _a.nonce;
    }
    UUIDs.toNonce = toNonce;
    function format(uuid) {
        if (uuid === undefined) {
            return 'undefined';
        }
        const seq = parse(uuid);
        return `${uuid} (nonce=${seq === null || seq === void 0 ? void 0 : seq.nonce})`;
    }
    UUIDs.format = format;
    function compare(u0, u1) {
        if (u0 === undefined && u1 !== undefined) {
            return -1;
        }
        if (u0 === undefined && u1 === undefined) {
            return 0;
        }
        if (u0 !== undefined && u1 === undefined) {
            return 1;
        }
        return cmp(u0, u1);
    }
    UUIDs.compare = compare;
    function compare2(u0, u1) {
        if (u0 === undefined && u1 !== undefined) {
            return -1;
        }
        if (u0 === undefined && u1 === undefined) {
            return 0;
        }
        if (u0 !== undefined && u1 === undefined) {
            return 1;
        }
        return cmp2(u0, u1);
    }
    UUIDs.compare2 = compare2;
    function cmp(s0, s1) {
        return s0.localeCompare(s1, "en-us");
    }
    UUIDs.cmp = cmp;
    function cmp2(s0, s1) {
        return s1.localeCompare(s0, "en-us");
    }
    UUIDs.cmp2 = cmp2;
    function isUpdated(existing, comparison) {
        return compare(existing, comparison) < 0;
    }
    UUIDs.isUpdated = isUpdated;
})(UUIDs = exports.UUIDs || (exports.UUIDs = {}));
//# sourceMappingURL=UUIDs.js.map