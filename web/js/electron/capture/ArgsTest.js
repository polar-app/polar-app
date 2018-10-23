"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("../../test/Assertions");
const Args_1 = require("./Args");
describe('Args', function () {
    describe('parse', function () {
        it("no args", function () {
            Assertions_1.assertJSON(Args_1.Args.parse([]), {
                "quit": true,
                "browser": "DEFAULT",
                "profile": "WEBVIEW",
                "amp": true
            });
        });
        it("change browser", function () {
            Assertions_1.assertJSON(Args_1.Args.parse(["--browser=TEST_BROWSER"]), {
                "browser": "TEST_BROWSER",
                "quit": true,
                "profile": "WEBVIEW",
                "amp": true
            });
        });
    });
});
//# sourceMappingURL=ArgsTest.js.map