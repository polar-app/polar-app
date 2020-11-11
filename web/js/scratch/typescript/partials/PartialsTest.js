"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
class Address {
    constructor(city, state, zip) {
        this.city = "San Francisco";
        this.state = "CA";
        this.zip = 94107;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }
    static create(address) {
        let result = Object.create(Address.prototype);
        Object.assign(result, address);
        return result;
    }
}
describe('Partials', function () {
    xit("Test basic partial", function () {
        Address.create({});
    });
    xit("Test defaults with partials", function () {
        let address = Address.create({});
        chai_1.assert.equal(address.city, "San Francisco");
    });
    xit("Readonly types.", function () {
        let address = Address.create({});
        chai_1.assert.equal(address.city, "San Francisco");
    });
});
//# sourceMappingURL=PartialsTest.js.map