const $ = require('jquery');
const {Preconditions} = require("../Preconditions");
const {Rects} = require("../Rects");

class Elements {

    /**
     *
     * Compute the offset relative to another parent element.  This can be used
     * to compute the absolute position of an element on a page.
     *
     * @param element
     * @param [parentElement] {HTMLElement} relative to this parentElement.
     * @return {Rect}
     */
    static getRelativeOffsetRect(element, parentElement) {

        Preconditions.assertNotNull(element, "element");

        if(! parentElement) {
            parentElement = element.ownerDocument.body;
        }

        let offsetRect = {left: 0, top: 0, width: 0, height: 0};

        function toInt(value) {

            if ( isNaN( value ) ) {
                return 0;
            }

            return value;

        }

        offsetRect.width = toInt(element.offsetWidth);
        offsetRect.height = toInt(element.offsetHeight);

        while(element !== null) {

            offsetRect.left += toInt(element.offsetLeft);
            offsetRect.top += toInt(element.offsetTop);

            if(element === parentElement)
                break;

            element = element.offsetParent;

        }

        return Rects.createFromBasicRect(offsetRect);

    }

    /**
     * Create a div from the given innerHTML and return it.
     *
     * @param innerHTML
     * @return {HTMLDivElement}
     */
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
            height: element.offsetHeight
        };

        result.right = result.left + result.width;
        result.bottom = result.top + result.height;

        return Rects.validate(result)

    }

    /**
     * Require that the element have the given classname.
     */
    static requireClass(element, clazz) {

        let classValue = element.getAttribute("class");

        if( ! classValue || classValue.indexOf(clazz) === -1) {

            // element isn't the proper class we're expecting.
            throw new Error("Element does not have the proper class: " + clazz)

        }

    }

    /**
     *
     * @param element
     * @param parentElement
     * @return {number}
     * @deprecated
     */
    static offsetRelative(element, parentElement) {

        let offsetLeft = 0;

        do {

            if ( !isNaN( elem.offsetLeft ) ) {
                offsetLeft += elem.offsetLeft;
            }

        } while(element = elem.offsetParent && element !== parentElement);

        return offsetLeft;

    }

    /**
     * Keep searching parent notes until we find an element matching the selector,
     * or return null when one was not found.
     *
     * @param selector
     */
    static untilRoot(element, selector) {

        if (!element)
            throw new Error("element required");

        if (!selector)
            throw new Error("selector required");

        if(element.matches(selector)) {
            return element;
        }

        if (element.parentElement == null) {
            // we have hit the root.
            return null;
        }

        return Elements.untilRoot(element.parentElement, selector);

    }

    static calculateVisibilityForDiv(div) {

        if(div == null)
            throw Error("Not given a div");

        let windowHeight = $(window).height(),
            docScroll = $(document).scrollTop(),
            divPosition = $(div).offset().top,
            divHeight = $(div).height();

        let hiddenBefore = docScroll - divPosition,
            hiddenAfter = (divPosition + divHeight) - (docScroll + windowHeight);

        if ((docScroll > divPosition + divHeight) || (divPosition > docScroll + windowHeight)) {
            return 0;
        } else {
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

module.exports.Elements = Elements;
