"use strict";
const { Objects } = require("./Objects");
const { assertJSON } = require("../test/Assertions");
describe('Objects', function () {
    describe('defaults', function () {
        it("with no current", function () {
            let value = Objects.defaults(null, { hello: "world" });
            assertJSON(value, { hello: "world" });
        });
        it("with no value", function () {
            let value = Objects.defaults({}, { hello: "world" });
            assertJSON(value, { hello: "world" });
        });
        it("with existing", function () {
            let value = Objects.defaults({ hello: "buddy" }, { hello: "world" });
            assertJSON(value, { hello: "buddy" });
        });
    });
    describe('clear', function () {
        it("clear dictionary", function () {
            let myDict = {
                hello: "world"
            };
            Objects.clear(myDict);
            assertJSON(myDict, {});
        });
        it("clear array", function () {
            let myArr = [
                "world"
            ];
            Objects.clear(myArr);
            assertJSON(myArr, []);
        });
    });
    describe('createInstance', function () {
        class Address {
            constructor(city, state, zip) {
                this.city = city;
                this.state = state;
                this.zip = zip;
            }
        }
        class Animal {
        }
        it("using generics", function () {
            let myDict = {
                city: "San Francisco",
                state: "CA",
                zip: 94107
            };
            function myFunc(address) {
            }
            let animal = new Animal();
        });
        it("should not compile", function () {
            function create(proto) {
                return Object.create(proto);
            }
            function createInstance(prototype, val) {
                let result = create(prototype);
                return val;
            }
            let val = createInstance(Address.prototype, {});
        });
    });
});
//# sourceMappingURL=ObjectsTest.js.map