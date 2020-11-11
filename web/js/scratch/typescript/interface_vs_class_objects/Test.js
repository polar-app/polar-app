"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Address {
    constructor(city, state, zip) {
        this.city = city;
        this.state = state;
        this.zip = zip;
    }
    static create(archetype) {
        return new Address(archetype.city, archetype.state, archetype.zip);
    }
}
function fromAddress(obj) {
    return obj;
}
function toIAddress(obj) {
    return obj;
}
let address0 = {};
let address1 = {};
let address2 = {};
describe('Test', function () {
    it("Basic test", function () {
        let address = Address.create({
            city: 'San Francisco',
            state: 'CA',
            zip: 94546
        });
        console.log("FIXME: " + typeof address);
        console.log("FIXME: " + (address instanceof Address));
    });
});
//# sourceMappingURL=Test.js.map