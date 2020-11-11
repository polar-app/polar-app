"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LazyComponents_1 = require("./LazyComponents");
const chai_1 = require("chai");
describe('LazyComponent', function () {
    it('basic', function () {
        chai_1.assert.ok(LazyComponents_1.lazyEquals(1, 1));
        chai_1.assert.ok(LazyComponents_1.lazyEquals(null, null));
        chai_1.assert.ok(LazyComponents_1.lazyEquals(undefined, undefined));
        chai_1.assert.ok(LazyComponents_1.lazyEquals({ oid: 1 }, { oid: 1 }));
        chai_1.assert.isFalse(LazyComponents_1.lazyEquals(false, true));
        chai_1.assert.isFalse(LazyComponents_1.lazyEquals(null, undefined));
        chai_1.assert.isFalse(LazyComponents_1.lazyEquals(1, "1"));
    });
});
//# sourceMappingURL=LazyComponentTest.js.map