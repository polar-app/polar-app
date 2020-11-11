"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ArgsParser_1 = require("./ArgsParser");
describe('ArgsParser', function () {
    describe('_toKey', function () {
        it("basic", function () {
            chai_1.assert.equal(ArgsParser_1.ArgsParser._toKey("--foo"), "foo");
        });
        it("basic with upper", function () {
            chai_1.assert.equal(ArgsParser_1.ArgsParser._toKey("--enable-foo"), "enableFoo");
        });
    });
    describe('parse', function () {
        it("basic", function () {
            let args = ArgsParser_1.ArgsParser.parse(["foo", "bar", "--cat=dog", "--enable-foo=true"]);
            chai_1.assert.deepEqual(args, {
                cat: 'dog',
                enableFoo: true
            });
        });
    });
});
//# sourceMappingURL=ArgsParserTest.js.map