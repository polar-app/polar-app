"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const EmailAddressParser_1 = require("./EmailAddressParser");
describe('EmailAddressParser', function () {
    it("basic", function () {
        chai_1.assert.deepEqual([], EmailAddressParser_1.EmailAddressParser.parse(""));
        chai_1.assert.deepEqual(["alice@example.com"], EmailAddressParser_1.EmailAddressParser.parse("alice@example.com"));
        chai_1.assert.deepEqual(["alice+foo@example.com"], EmailAddressParser_1.EmailAddressParser.parse("alice+foo@example.com"));
        chai_1.assert.deepEqual(["alice@example.com", "bob@example.com"], EmailAddressParser_1.EmailAddressParser.parse("alice@example.com, bob@example.com"));
        chai_1.assert.deepEqual(["alice@example.com", "bob+test@example.com"], EmailAddressParser_1.EmailAddressParser.parse("alice@example.com; bob+test@example.com"));
    });
});
//# sourceMappingURL=EmailAddressParserTest.js.map