"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elements = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Rects_1 = require("../Rects");
const $ = require('jquery');
class Elements {
    static getRelativeOffsetRect(element, parentElement) {
        Preconditions_1.Preconditions.assertNotNull(element, "element");
        if (!parentElement) {
            parentElement = element.ownerDocument.documentElement;
        }
        const offsetRect = { left: 0, top: 0, width: 0, height: 0 };
        function toInt(value) {
            if (isNaN(value)) {
                return 0;
            }
            return value;
        }
        offsetRect.width = toInt(element.offsetWidth);
        offsetRect.height = toInt(element.offsetHeight);
        while (element !== null) {
            if (element === parentElement) {
                break;
            }
            offsetRect.left += toInt(element.offsetLeft);
            offsetRect.top += toInt(element.offsetTop);
            element = element.offsetParent;
        }
        return Rects_1.Rects.createFromBasicRect(offsetRect);
    }
    static createWrapperElementHTML(innerHTML) {
        const div = document.createElement("div");
        div.innerHTML = innerHTML;
        return div;
    }
    static createElementHTML(html, tagName = 'div') {
        const div = document.createElement(tagName);
        div.innerHTML = html;
        return div.firstChild;
    }
    static offset(element) {
        const result = {
            left: element.offsetLeft,
            top: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight,
            right: 0,
            bottom: 0
        };
        result.right = result.left + result.width;
        result.bottom = result.top + result.height;
        return Rects_1.Rects.validate(Rects_1.Rects.createFromBasicRect(result));
    }
    static requireClass(element, clazz) {
        const classValue = element.getAttribute("class");
        if (!classValue || classValue.indexOf(clazz) === -1) {
            throw new Error("Element does not have the proper class: " + clazz);
        }
    }
    static untilRoot(element, selector) {
        if (!element) {
            throw new Error("element required");
        }
        if (!selector) {
            throw new Error("selector required");
        }
        if (element.matches(selector)) {
            return element;
        }
        if (element.parentElement == null) {
            return null;
        }
        return Elements.untilRoot(element.parentElement, selector);
    }
    static calculateVisibilityForDiv(div) {
        if (div == null) {
            throw Error("Not given a div");
        }
        const windowHeight = $(window).height();
        const docScroll = $(document).scrollTop();
        const divPosition = $(div).offset().top;
        const divHeight = $(div).height();
        const hiddenBefore = docScroll - divPosition;
        const hiddenAfter = (divPosition + divHeight) - (docScroll + windowHeight);
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
    static getScrollParent(element) {
        if (!element) {
            return undefined;
        }
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;
        if (scrollHeight > clientHeight) {
            return element;
        }
        else {
            return this.getScrollParent(element.parentElement);
        }
    }
}
exports.Elements = Elements;
//# sourceMappingURL=Elements.js.map