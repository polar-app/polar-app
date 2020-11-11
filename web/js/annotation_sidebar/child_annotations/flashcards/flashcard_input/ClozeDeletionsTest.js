"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ClozeDeletions_1 = require("./ClozeDeletions");
const Assertions_1 = require("../../../../test/Assertions");
describe('ClozeDeletions', function () {
    it("basic", function () {
        Assertions_1.assertJSON(ClozeDeletions_1.ClozeDeletions.parse(""), []);
        Assertions_1.assertJSON(ClozeDeletions_1.ClozeDeletions.parse("{{c1::1913}}"), [1]);
        Assertions_1.assertJSON(ClozeDeletions_1.ClozeDeletions.parse("{{c1::1913}} {{c2::1913}}"), [1, 2]);
        Assertions_1.assertJSON(ClozeDeletions_1.ClozeDeletions.parse("{{c1::1913}} {{c99::1913}}"), [1, 99]);
    });
    it("next", function () {
        chai_1.assert.equal(ClozeDeletions_1.ClozeDeletions.next(""), 1);
        chai_1.assert.equal(ClozeDeletions_1.ClozeDeletions.next("{{c1::1913}}"), 2);
        chai_1.assert.equal(ClozeDeletions_1.ClozeDeletions.next("{{c1::1913}} {{c2::1913}}"), 3);
        chai_1.assert.equal(ClozeDeletions_1.ClozeDeletions.next("{{c1::1913}} {{c99::1913}}"), 100);
    });
});
//# sourceMappingURL=ClozeDeletionsTest.js.map