"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Rects_1 = require("./Rects");
const Assertions_1 = require("./test/Assertions");
const Rect_1 = require("./Rect");
const RectArt_1 = require("./util/RectArt");
const MockRects_1 = require("./MockRects");
describe('Rects', function () {
    describe('perc', function () {
        it("basic perc", function () {
            const a = Rects_1.Rects.createFromBasicRect({
                top: 0,
                left: 0,
                width: 50,
                height: 50
            });
            const b = Rects_1.Rects.createFromBasicRect({
                top: 0,
                left: 0,
                width: 100,
                height: 100
            });
            const actual = Rects_1.Rects.perc(a, b);
            const expected = {
                "left": 0,
                "top": 0,
                "right": 50,
                "bottom": 50,
                "width": 50,
                "height": 50
            };
            Assertions_1.assertJSON(actual, expected);
        });
    });
    describe('scale', function () {
        it("basic scale", function () {
            let rect = new Rect_1.Rect({
                top: 100,
                left: 100,
                bottom: 200,
                right: 200,
                width: 100,
                height: 100,
            });
            let actual = Rects_1.Rects.scale(rect, 2.0);
            let expected = {
                "left": 200,
                "top": 200,
                "right": 400,
                "bottom": 400,
                "width": 200,
                "height": 200
            };
            Assertions_1.assertJSON(actual, expected);
        });
    });
    describe('intersect + overlap', () => {
        test("not_intersected", false, false);
        test("basic_test", true, true);
        test("intersected_right", true, true);
        test("intersected_left", true, true);
        test("intersected_top", true, true);
        test("intersected_bottom", true, true);
        test("intersected_bottom_left", true, true);
        function test(name, expectedIntersect, expectedOverlap) {
            it(name, () => {
                let rects = MockRects_1.MOCK_RECTS[name];
                console.log("\n" + RectArt_1.RectArt.formatRects([rects.rect0, rects.rect1]).toString());
                chai_1.assert.equal(Rects_1.Rects.intersect(rects.rect0, rects.rect1), expectedIntersect);
                chai_1.assert.equal(Rects_1.Rects.overlap(rects.rect0, rects.rect1), expectedOverlap);
            });
        }
    });
    describe('intersectedPositions', function () {
        it("not intersected", function () {
            let rect0 = Rects_1.Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });
            let rect1 = Rects_1.Rects.createFromBasicRect({
                "left": 300,
                "top": 300,
                "width": 100,
                "height": 100
            });
            Assertions_1.assertJSON(Rects_1.Rects.intersectedPositions(rect0, rect1), []);
        });
        it("intersected right", function () {
            let rect0 = Rects_1.Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });
            let rect1 = Rects_1.Rects.createFromBasicRect({
                "left": 150,
                "top": 100,
                "width": 100,
                "height": 100
            });
            Assertions_1.assertJSON(Rects_1.Rects.intersectedPositions(rect0, rect1), ["right", "top", "bottom"]);
        });
        it("intersected left", function () {
            let rect0 = Rects_1.Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });
            let rect1 = Rects_1.Rects.createFromBasicRect({
                "left": 50,
                "top": 100,
                "width": 100,
                "height": 100
            });
            Assertions_1.assertJSON(Rects_1.Rects.intersectedPositions(rect0, rect1), ["left", "top", "bottom"]);
        });
        it("intersected top", function () {
            let rect0 = Rects_1.Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });
            let rect1 = Rects_1.Rects.createFromBasicRect({
                "left": 100,
                "top": 50,
                "width": 100,
                "height": 100
            });
            Assertions_1.assertJSON(Rects_1.Rects.intersectedPositions(rect0, rect1), ["left", "right", "top"]);
        });
        it("intersected bottom", function () {
            let rect0 = Rects_1.Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });
            let rect1 = Rects_1.Rects.createFromBasicRect({
                "left": 100,
                "top": 150,
                "width": 100,
                "height": 100
            });
            Assertions_1.assertJSON(Rects_1.Rects.intersectedPositions(rect0, rect1), ["left", "right", "bottom"]);
        });
        it("intersected bottom left", function () {
            let rect0 = Rects_1.Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });
            let rect1 = Rects_1.Rects.createFromBasicRect({
                "left": 50,
                "top": 150,
                "width": 100,
                "height": 100
            });
            Assertions_1.assertJSON(Rects_1.Rects.intersectedPositions(rect0, rect1), ["left", "bottom"]);
        });
    });
});
//# sourceMappingURL=RectsTest.js.map