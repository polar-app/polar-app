"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("reflect-metadata");
describe('AbstractMethodCalls', function () {
    it("basic", function () {
        let handledGo = false;
        class Vehicle {
            go() {
                this.handleGo();
            }
        }
        class Car extends Vehicle {
            handleGo() {
                handledGo = true;
            }
        }
        new Car().go();
        chai_1.assert.ok(handledGo);
    });
});
//# sourceMappingURL=AbstractMethodCallsTest.js.map