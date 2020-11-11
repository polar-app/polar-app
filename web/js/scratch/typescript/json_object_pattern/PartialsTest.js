"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
class Address {
    constructor(address) {
        this.city = address.city;
        this.state = address.state;
        this.zip = address.zip;
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