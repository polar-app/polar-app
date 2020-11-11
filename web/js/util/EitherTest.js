"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Either_1 = require("./Either");
const Assertions_1 = require("../test/Assertions");
describe('Either', function () {
    it("basic", function () {
        const values = [];
        const myFunction = (either) => {
            either.handle((left) => values.push(left), (right) => values.push(right));
        };
        myFunction(Either_1.Either.ofLeft("left"));
        myFunction(Either_1.Either.ofRight(101));
        Assertions_1.assertJSON(values, [
            "left",
            101
        ]);
    });
    it("convertLeftToRight", function () {
        const either0 = Either_1.Either.ofLeft('123');
        const either1 = Either_1.Either.ofRight(123);
        chai_1.assert.equal(either0.convertLeftToRight(value => Number.parseInt(value)), 123);
        chai_1.assert.equal(either1.convertLeftToRight(value => Number.parseInt(value)), 123);
    });
});
//# sourceMappingURL=EitherTest.js.map