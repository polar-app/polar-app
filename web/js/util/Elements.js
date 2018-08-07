"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
const $ = require('jquery');
const { Rects } = require("../Rects");
class Elements {
    static getRelativeOffsetRect(element, parentElement) {
        Preconditions_1.Preconditions.assertNotNull(element, "element");
        if (!parentElement) {
            parentElement = element.ownerDocument.documentElement;
        }
        let offsetRect = { left: 0, top: 0, width: 0, height: 0 };
        function toInt(value) {
            if (isNaN(value)) {
                return 0;
            }
            return value;
        }
        offsetRect.width = toInt(element.offsetWidth);
        offsetRect.height = toInt(element.offsetHeight);
        while (element !== null) {
            if (element === parentElement)
                break;
            offsetRect.left += toInt(element.offsetLeft);
            offsetRect.top += toInt(element.offsetTop);
            element = element.offsetParent;
        }
        return Rects.createFromBasicRect(offsetRect);
    }
    static createElementHTML(innerHTML) {
        let div = document.createElement("div");
        div.innerHTML = innerHTML;
        return div;
    }
    static offset(element) {
        let result = {
            left: element.offsetLeft,
            top: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight,
            right: 0,
            bottom: 0
        };
        result.right = result.left + result.width;
        result.bottom = result.top + result.height;
        return Rects.validate(Rects.createFromBasicRect(result));
    }
    static requireClass(element, clazz) {
        let classValue = element.getAttribute("class");
        if (!classValue || classValue.indexOf(clazz) === -1) {
            throw new Error("Element does not have the proper class: " + clazz);
        }
    }
    static untilRoot(element, selector) {
        if (!element)
            throw new Error("element required");
        if (!selector)
            throw new Error("selector required");
        if (element.matches(selector)) {
            return element;
        }
        if (element.parentElement == null) {
            return null;
        }
        return Elements.untilRoot(element.parentElement, selector);
    }
    static calculateVisibilityForDiv(div) {
        if (div == null)
            throw Error("Not given a div");
        let windowHeight = $(window).height(), docScroll = $(document).scrollTop(), divPosition = $(div).offset().top, divHeight = $(div).height();
        let hiddenBefore = docScroll - divPosition, hiddenAfter = (divPosition + divHeight) - (docScroll + windowHeight);
        if ((docScroll > divPosition + divHeight) || (divPosition > docScroll + windowHeight)) {
            return 0;
        }
        else {
            let result = 100;
            if (hiddenBefore > 0) {
                result -= (hiddenBefore * 100) / divHeight;
            }
            if (hiddenAfter > 0) {
                result -= (hiddenAfter * 100) / divHeight;
            }
            return result;
        }
    }
}
exports.Elements = Elements;
//# sourceMappingURL=Elements.js.map