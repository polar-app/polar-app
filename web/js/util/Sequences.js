"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequences = void 0;
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Strings_1 = require("polar-shared/src/util/Strings");
var Sequences;
(function (Sequences) {
    Sequences.MACHINE = Math.floor(999999999999 * Math.random());
    Sequences.NONCE = 0;
    function create() {
        if (Sequences.NONCE > 999999) {
            Sequences.NONCE = 0;
        }
        const nonce = Strings_1.Strings.lpad(Sequences.NONCE++, '0', 6);
        const machine = Strings_1.Strings.lpad(Sequences.MACHINE, '0', 12);
        return 'z' + ISODateTimeStrings_1.ISODateTimeStrings.create() + `+${nonce}-${machine}`;
    }
    Sequences.create = create;
    function parse(sequence) {
        if (!sequence) {
            return undefined;
        }
        const regexp = "z(.{24})\\+([0-9]+)-([0-9]+)";
        const re = new RegExp(regexp);
        const match = re.exec(sequence);
        if (match) {
            return {
                timestamp: match[1],
                nonce: match[2],
                machine: match[3]
            };
        }
        else {
            return undefined;
        }
    }
    Sequences.parse = parse;
    function toNonce(sequence) {
        var _a;
        return (_a = parse(sequence)) === null || _a === void 0 ? void 0 : _a.nonce;
    }
    Sequences.toNonce = toNonce;
})(Sequences = exports.Sequences || (exports.Sequences = {}));
//# sourceMappingURL=Sequences.js.map