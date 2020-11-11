"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClozeDeletions = void 0;
const RegExps_1 = require("polar-shared/src/util/RegExps");
const Tuples_1 = require("polar-shared/src/util/Tuples");
const Arrays_1 = require("polar-shared/src/util/Arrays");
var ClozeDeletions;
(function (ClozeDeletions) {
    function parse(text) {
        return RegExps_1.RegExps.matches(/{{c([0-9]+)/g, text)
            .map(current => parseInt(current[1]));
    }
    ClozeDeletions.parse = parse;
    const NEXT_ALLOW_GAPS = false;
    function next(text) {
        const clozes = [...parse(text)].sort();
        if (clozes.length === 0) {
            return 1;
        }
        function predicate(sibling) {
            function computeGap() {
                if (sibling.prev === undefined) {
                    return sibling.curr - 0;
                }
                return sibling.curr - sibling.prev;
            }
            const gap = computeGap();
            return gap > 1;
        }
        if (NEXT_ALLOW_GAPS) {
            const gaps = Tuples_1.Tuples.createSiblings(clozes)
                .filter(predicate);
            if (gaps.length > 0) {
                return gaps[0].prev + 1;
            }
        }
        return Arrays_1.Arrays.last(clozes) + 1;
    }
    ClozeDeletions.next = next;
})(ClozeDeletions = exports.ClozeDeletions || (exports.ClozeDeletions = {}));
//# sourceMappingURL=ClozeDeletions.js.map