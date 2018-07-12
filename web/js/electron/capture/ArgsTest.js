const assert = require('assert');
const {Args} = require('./Args');
const {assertJSON} = require("../../test/Assertions");

describe('Args', function() {

    describe('parse', function() {

        it("no args", function () {

            assertJSON(Args.parse([]), {
                    "quit": true,
                    "browser": "MOBILE_GALAXY_S8_WITH_CHROME_61_WIDTH_750",
                    "profile": "headless"
                }
            );

        });

        it("change browser", function () {
            assertJSON(Args.parse(["--browser=TEST_BROWSER"]), {
                "browser": "TEST_BROWSER",
                "quit": true,
                "profile": "headless"
            });
        });

    });

});
