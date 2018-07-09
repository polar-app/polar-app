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


    describe('intersectedPositions', function() {

        it("not intersected", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 300,
                "top": 300,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), []);

        });

        it("intersected right", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 150,
                "top": 100,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["right", "top", "bottom"]);

        });

        it("intersected left", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 50,
                "top": 100,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "top", "bottom"]);

        });


        it("intersected top", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 100,
                "top": 50,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "right", "top"]);

        });

        it("intersected bottom", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 100,
                "top": 150,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "right", "bottom"]);

        });

        it("intersected bottom left", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 50,
                "top": 150,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "bottom"]);

        });

    });

    describe('relativePositions', function() {

        // FIXME: this is complicated by the width / etc of the rect...

        // if a were to envelop b then it would look like it was on ALL
        // sides... which might be ok

        it("a directly above b", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 100,
                "top": 300,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.relativePositions(rect0, rect1), []);

        });

        it("intersected right", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 150,
                "top": 100,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["right", "top", "bottom"]);

        });

        it("intersected left", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 50,
                "top": 100,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "top", "bottom"]);

        });


        it("intersected top", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 100,
                "top": 50,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "right", "top"]);

        });

        it("intersected bottom", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 100,
                "top": 150,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "right", "bottom"]);

        });

        it("intersected bottom left", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 50,
                "top": 150,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "bottom"]);

        });

    });

});
