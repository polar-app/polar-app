const assert = require('assert');

const {Rects} = require("./Rects");
const {assertJSON} = require("./test/Assertions");

describe('Rects', function() {

    describe('scale', function() {

        it("basic scale", function () {

            let rect = {
                top: 100,
                left: 100,
                bottom: 200,
                right: 200,
                width: 100,
                height: 100,
            };

            let actual = Rects.scale(rect, 2.0);
            let expected = {
                "top": 200,
                "left": 200,
                "bottom": 400,
                "right": 400,
                "width": 200,
                "height": 200
            };

            assertJSON(actual, expected);

        });


    });


    describe('intersected', function() {

        it("basic test", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 301,
                "top": 137,
                "right": 501,
                "bottom": 337,
                "width": 200,
                "height": 200
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 400,
                "top": 150,
                "right": 500,
                "bottom": 250,
                "width": 100,
                "height": 100
            });

            assert.equal(Rects.intersect(rect0, rect1), true);

        });


    });


});
