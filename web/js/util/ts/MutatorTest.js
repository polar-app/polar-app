"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mutator_1 = require("./Mutator");
const chai_1 = require("chai");
describe('Mutator', function () {
    it("Test mutation", function () {
        let name = {
            first: 'Alice',
            last: 'Smith'
        };
        name = Mutator_1.Mutator.mutate(name, (current) => {
            current.first = 'Bob';
            return current;
        });
        chai_1.assert.equal(name.first, 'Bob');
    });
});
//# sourceMappingURL=MutatorTest.js.map