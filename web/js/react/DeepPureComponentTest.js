"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const isEqual = require("react-fast-compare");
describe('DeepPureComponent', function () {
    it('basic', function () {
        const myFunction0 = () => 1 + 1;
        const myFunction1 = () => 1 + 2;
        chai_1.assert.isTrue(isEqual({ func: myFunction0 }, { func: myFunction0 }));
        chai_1.assert.isFalse(isEqual({ func: myFunction0 }, { func: myFunction1 }));
    });
});
//# sourceMappingURL=DeepPureComponentTest.js.map