const assert = require('assert');
const {Args} = require('./Args');

describe('Args', function() {

    describe('parse', function() {

        it("no args", function () {

            assert.deepEqual(Args.parse([]), {
                quit: true,
                browser: 'MOBILE_GALAXY_S8_WITH_CHROME_61_WIDTH_750'
            });

        });

        it("change browser", function () {
            assert.deepEqual(Args.parse(["--browser=TEST_BROWSER"]), {
                quit: true,
                browser: 'TEST_BROWSER'
            });
        });

    });

});
