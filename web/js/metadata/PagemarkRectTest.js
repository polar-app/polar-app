const assert = require('assert');
const {assertJSON} = require("../test/Assertions");
const {PagemarkRect} = require("./PagemarkRect");

describe('PagemarkRect', function() {

    describe('interval', function() {

        it("proper interval", function () {

            let pagemarkRect = new PagemarkRect({
                left: 0,
                top: 0,
                width: 100,
                height: 100
            });

            let expected = {
                    "left": 0,
                    "top": 0,
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

    describe('toPercentage  + toFractionalRect', function() {

        it("100%", function () {

            let pagemarkRect = new PagemarkRect({
                top: 0,
                left: 0,
                width: 100,
                height: 100
            });

            assertJSON(pagemarkRect.toPercentage(), 100);

            let expected = {
                "left": 0,
                "top": 0,
                "right": 1,
                "bottom": 1,
                "width": 1,
                "height": 1
            };

            assertJSON(pagemarkRect.toFractionalRect(), expected);

        });


        it("50%", function () {

            let pagemarkRect = new PagemarkRect({
                top: 0,
                left: 0,
                width: 100,
                height: 50
            });

            assertJSON(pagemarkRect.toPercentage(), 50);

            let expected = {
                "left": 0,
                "top": 0,
                "right": 1,
                "bottom": 0.5,
                "width": 1,
                "height": 0.5
            };

            assertJSON(pagemarkRect.toFractionalRect(), expected);


        });

        it("25%", function () {

            let pagemarkRect = new PagemarkRect({
                top: 0,
                left: 0,
                width: 50,
                height: 50
            });

            assertJSON(pagemarkRect.toPercentage(), 25)

            let expected = {
                "left": 0,
                "top": 0,
                "right": 0.50,
                "bottom": 0.50,
                "width": 0.50,
                "height": 0.50
            };

            assertJSON(pagemarkRect.toFractionalRect(), expected);

        });

    });

});
