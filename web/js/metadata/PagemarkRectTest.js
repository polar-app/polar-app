const assert = require('assert');
const {assertJSON} = require("../test/Assertions");
const {PagemarkRect} = require("./PagemarkRect");

require("../test/TestingTime").freeze();

describe('PagemarkRect', function() {

    describe('interval', function() {

        it("proper interval", function () {

            let pagemarkRect = new PagemarkRect({
                top: 0,
                left: 0,
                width: 100,
                height: 100
            });

            let expected = {
                    "top": 0,
                    "left": 0,
                    "width": 100,
                    "height": 100
                }
            ;
            assertJSON(pagemarkRect, expected)

        });

        it("wrong interval", function () {

            assert.throws(() => {
                new PagemarkRect({
                    top: 0,
                    left: 0,
                    width: -100,
                    height: -100
                });
            }, "Incorrectly accepted wrong interval")

        });

    });

    describe('toPercent', function() {

        it("100%", function () {

            let pagemarkRect = new PagemarkRect({
                top: 0,
                left: 0,
                width: 100,
                height: 100
            });

            assertJSON(pagemarkRect.toPercentage(), 100)

        });


        it("50%", function () {

            let pagemarkRect = new PagemarkRect({
                top: 0,
                left: 0,
                width: 100,
                height: 50
            });

            assertJSON(pagemarkRect.toPercentage(), 50)

        });


        it("25%", function () {

            let pagemarkRect = new PagemarkRect({
                top: 0,
                left: 0,
                width: 50,
                height: 50
            });

            assertJSON(pagemarkRect.toPercentage(), 25)

        });

    });

});
