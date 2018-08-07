import {Preconditions} from '../Preconditions';

const $ = require('jquery');
const {Rects} = require("../Rects");

export class Elements {

    /**
     *
     * Compute the offset relative to another parent element.  This can be used
     * to compute the absolute position of an element on a page.
     *
     * @param element
     * @param [parentElement] {HTMLElement} relative to this parentElement.
     *        By default we are relative to the document root (documentElement).
     * @return {Rect}
     */

    // FIXME: this should be getPageOffsetRect and have a relativeToParentElement which is optional.
    static getRelativeOffsetRect(element: HTMLElement, parentElement?: HTMLElement): any {

        Preconditions.assertNotNull(element, "element");

        if(! parentElement) {
            parentElement = element.ownerDocument.documentElement;
        }

        let offsetRect = {left: 0, top: 0, width: 0, height: 0};

        function toInt(value: number) {
            if ( isNaN(value) ) {
                return 0;
            }
            return value;
        }

        offsetRect.width = toInt(element.offsetWidth);
        offsetRect.height = toInt(element.offsetHeight);

        while(element !== null) {

            if(element === parentElement)
                break;

            offsetRect.left += toInt(element.offsetLeft);
            offsetRect.top += toInt(element.offsetTop);

            // TO: Do I have to factor in scrollTop here.. this is insane.
            // I think this isn't true... I think the problem is that the page
            // position changes WRT scrolling.

            //offsetRect.left += toInt(element.scrollLeft);
            //offsetRect.top += toInt(element.scrollTop);

            element = <HTMLElement>element.offsetParent;

        }

        return Rects.createFromBasicRect(offsetRect);

    }

    /**
     * Create a div from the given innerHTML and return it.
     *
     * @param innerHTML
     * @return {HTMLDivElement}
     */
    static createElementHTML(innerHTML: string) {

        let div = document.createElement("div");
        div.innerHTML = innerHTML;

        return div;

    }

    static offset(element: HTMLElement) {

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

    /**
     * Require that the element have the given classname.
     */
    static requireClass(element: HTMLElement, clazz: string) {

        let classValue = element.getAttribute("class");

        if( ! classValue || classValue.indexOf(clazz) === -1) {

            // element isn't the proper class we're expecting.
            throw new Error("Element does not have the proper class: " + clazz)

        }

    }

    /**
     * Keep searching parent notes until we find an element matching the selector,
     * or return null when one was not found.
     *
     */
    static untilRoot(element: any, selector: string): any {

        // TODO: refactor this for typescript

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

    static calculateVisibilityForDiv(div: HTMLElement): number {

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
