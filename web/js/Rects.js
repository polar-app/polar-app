"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = require("./Rect");
const Preconditions_1 = require("./Preconditions");
const Styles_1 = require("./util/Styles");
const Objects_1 = require("./util/Objects");
class Rects {
    static isVisible(rect) {
        return rect.height > 0 && rect.width > 0;
    }
    static scale(rect, scale) {
        Preconditions_1.Preconditions.assertNotNull(rect, "rect");
        rect = Rects.validate(rect);
        rect = Object.assign(new Rect_1.Rect(), rect);
        let result = {};
        Objects_1.Objects.typedKeys(rect).forEach(key => {
            result[key] = rect[key] * scale;
        });
        return Rects.validate(result);
    }
    static validate(rect) {
        Preconditions_1.Preconditions.assertNotNull(rect.left, "left");
        Preconditions_1.Preconditions.assertNotNull(rect.top, "top");
        Preconditions_1.Preconditions.assertNotNull(rect.width, "width");
        Preconditions_1.Preconditions.assertNotNull(rect.height, "height");
        Preconditions_1.Preconditions.assertNotNull(rect.bottom, "bottom");
        Preconditions_1.Preconditions.assertNotNull(rect.right, "right");
        Preconditions_1.Preconditions.assertNumber(rect.left, "left");
        Preconditions_1.Preconditions.assertNumber(rect.top, "top");
        Preconditions_1.Preconditions.assertNumber(rect.width, "width");
        Preconditions_1.Preconditions.assertNumber(rect.height, "height");
        Preconditions_1.Preconditions.assertNumber(rect.bottom, "bottom");
        Preconditions_1.Preconditions.assertNumber(rect.right, "right");
        if (!(rect instanceof Rect_1.Rect)) {
            return new Rect_1.Rect(rect);
        }
        else {
            return rect;
        }
    }
    static relativeTo(point, rect) {
        rect = Rects.validate(rect);
        rect = Object.assign(new Rect_1.Rect(), rect);
        rect.left = rect.left + point.x;
        rect.top = rect.top + point.y;
        rect.right = rect.right + point.x;
        rect.bottom = rect.bottom + point.y;
        return Rects.validate(rect);
    }
    static move(rect, dir, absolute) {
        rect = Object.assign(new Rect_1.Rect(), rect);
        if (absolute) {
            if (dir.x !== undefined) {
                rect.left = dir.x;
                rect.right = rect.left + rect.width;
            }
            if (dir.y !== undefined) {
                rect.top = dir.y;
                rect.bottom = rect.top + rect.height;
            }
        }
        else {
            if (dir.x !== undefined) {
                rect.left = rect.left + dir.x;
                rect.right = rect.right + dir.x;
            }
            if (dir.y !== undefined) {
                rect.bottom = rect.bottom + dir.y;
                rect.top = rect.top + dir.y;
            }
        }
        return Rects.validate(rect);
    }
    static intersect(a, b) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    }
    static overlap(a, b) {
        return a.toLine("x").overlaps(b.toLine("x")) || a.toLine("y").overlaps(b.toLine("y"));
    }
    static intersection(a, b) {
        return Rects.createFromBasicRect({
            top: Math.max(a.top, b.top),
            bottom: Math.min(a.bottom, b.bottom),
            left: Math.max(a.left, b.left),
            right: Math.min(a.right, b.right),
        });
    }
    static intersectedPositions(a, b) {
        let result = [];
        if (_interval(a.left, b.right, a.right)) {
            result.push("left");
        }
        if (_interval(a.left, b.left, a.right)) {
            result.push("right");
        }
        if (_interval(a.top, b.bottom, a.bottom)) {
            result.push("top");
        }
        if (_interval(a.top, b.top, a.bottom)) {
            result.push("bottom");
        }
        return result;
    }
    static relativePositions(a, b) {
        Rects.validate(a);
        Rects.validate(b);
        let result = {};
        result.top = Math.abs(a.top - b.bottom);
        result.bottom = Math.abs(a.bottom - b.top);
        result.left = Math.abs(a.left - a.right);
        result.right = Math.abs(a.right - b.left);
        return result;
    }
    static subtract(a, b) {
        a = Rects.validate(a);
        b = Rects.validate(b);
        let keys = ["left", "top", "right", "bottom", "width", "height"];
        let result = {};
        keys.forEach(key => {
            result[key] = a[key] - b[key];
        });
        return new Rect_1.Rect(result);
    }
    static add(a, b) {
        a = Rects.validate(a);
        b = Rects.validate(b);
        let keys = ["left", "top", "right", "bottom", "width", "height"];
        let result = {};
        keys.forEach(key => {
            result[key] = a[key] + b[key];
        });
        return new Rect_1.Rect(result);
    }
    static perc(a, b) {
        if (a.width > b.width || a.height > b.height) {
            throw new Error(`Dimensions invalid ${a.dimensions} vs ${b.dimensions}`);
        }
        let result = {
            left: 100 * (a.left / b.width),
            right: 100 * (a.right / b.width),
            top: 100 * (a.top / b.height),
            bottom: 100 * (a.bottom / b.height)
        };
        return Rects.createFromBasicRect(result);
    }
    static createFromBasicRect(rect) {
        rect = Object.assign(new Rect_1.Rect(), rect);
        if (!rect.bottom && "top" in rect && "height" in rect) {
            rect.bottom = rect.top + rect.height;
        }
        if (!rect.right && "left" in rect && "width" in rect) {
            rect.right = rect.left + rect.width;
        }
        if (!rect.height && "bottom" in rect && "top" in rect) {
            rect.height = rect.bottom - rect.top;
        }
        if (!rect.width && "right" in rect && "left" in rect) {
            rect.width = rect.right - rect.left;
        }
        return Rects.validate(new Rect_1.Rect(rect));
    }
    static createFromLines(xAxis, yAxis) {
        Preconditions_1.Preconditions.assertNotNull(xAxis, "xAxis");
        Preconditions_1.Preconditions.assertNotNull(yAxis, "yAxis");
        Preconditions_1.Preconditions.assertEqual(xAxis.axis, "x", "xAxis.axis");
        Preconditions_1.Preconditions.assertEqual(yAxis.axis, "y", "yAxis.axis");
        return Rects.createFromBasicRect({
            left: xAxis.start,
            width: xAxis.length,
            top: yAxis.start,
            height: yAxis.length
        });
    }
    static createFromOffset(element) {
        return Rects.createFromBasicRect({
            left: element.offsetLeft,
            top: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight,
        });
    }
    static fromElementStyle(element) {
        let rect = {
            left: Styles_1.Styles.parsePX(element.style.left),
            top: Styles_1.Styles.parsePX(element.style.top),
            width: Styles_1.Styles.parsePX(element.style.width),
            height: Styles_1.Styles.parsePX(element.style.height)
        };
        return Rects.createFromBasicRect(rect);
    }
}
exports.Rects = Rects;
function _interval(min, point, max) {
    return min <= point && point <= max;
}
//# sourceMappingURL=Rects.js.map