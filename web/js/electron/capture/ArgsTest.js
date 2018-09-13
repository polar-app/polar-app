const assert = require('assert');
const {Args} = require('./Args');
const {assertJSON} = require("../../test/Assertions");

describe('Args', function() {

    describe('parse', function() {

        it("no args", function () {

            assertJSON(Args.parse([]), {
                    "quit": true,
                    "browser": "DEFAULT",
                    "profile": "WEBVIEW",
                    "amp": true
                }
            );

        });

        it("change browser", function () {
            assertJSON(Args.parse(["--browser=TEST_BROWSER"]), {
                "browser": "TEST_BROWSER",
                "quit": true,
                "profile": "WEBVIEW",
                "amp": true
            });
        });

    });

});
