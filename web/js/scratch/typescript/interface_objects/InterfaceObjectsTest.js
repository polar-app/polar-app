"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("../../../test/Assertions");
const chai_1 = require("chai");
describe('Custom objects from JSON', function () {
    it("No custom constructor", function () {
        class Address {
        }
        let address = Object.assign(new Address(), {
            city: "San Francisco",
            state: "California",
            zip: 94107
        });
        chai_1.assert.equal(address.constructor.name, "Address");
        let expected = {
            "city": "San Francisco",
            "state": "California",
            "zip": 94107
        };
        Assertions_1.assertJSON(address, expected);
    });
    it("Test of single interface object from JSON", function () {
        let address = {
            city: "San Francisco",
            state: "California",
            zip: 94107
        };
        let expected = {
            "city": "San Francisco",
            "state": "California",
            "zip": 94107
        };
        Assertions_1.assertJSON(address, expected);
    });
    it("Test of single interface object from JSON", function () {
        let address = [{
                city: "San Francisco",
                state: "California",
                zip: 94107
            }];
        let expected = [{
                "city": "San Francisco",
                "state": "California",
                "zip": 94107
            }];
        Assertions_1.assertJSON(address, expected);
    });
    it("type promotion and methods", function () {
        class Address {
            constructor(city, state, zip) {
                this.city = city;
                this.state = state;
                this.zip = zip;
            }
            format() {
                return `${this.city}, ${this.state} ${this.zip}`;
            }
        }
        let address;
        address = new Address("San Francisco", "CA", 94107);
        chai_1.assert.equal(address.constructor.name, "Address");
        chai_1.assert.notEqual(address.format, null);
        address = {};
        console.log(address.city);
    });
});
//# sourceMappingURL=InterfaceObjectsTest.js.map