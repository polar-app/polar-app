"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
const Elements_1 = require("../util/Elements");
class DocFormat {
    currentScale() {
        return 1.0;
    }
    getPageNumFromPageElement(pageElement) {
        Preconditions_1.Preconditions.assertNotNull(pageElement, "pageElement");
        let dataPageNum = Preconditions_1.notNull(pageElement.getAttribute("data-page-number"));
        return parseInt(dataPageNum);
    }
    getPageElementFromPageNum(pageNum) {
        if (!pageNum) {
            throw new Error("Page number not specified");
        }
        let pageElements = document.querySelectorAll(".page");
        let pageElement = pageElements[pageNum - 1];
        if (!pageElement) {
            throw new Error("Unable to find page element for page num: " + pageNum);
        }
        return pageElement;
    }
    getCurrentPageElement() {
        let pageElements = document.querySelectorAll(".page");
        if (pageElements.length === 1) {
            return pageElements[0];
        }
        let result = {
            element: null,
            visibility: 0
        };
        pageElements.forEach(pageElement => {
            let element = pageElement;
            let visibility = Elements_1.Elements.calculateVisibilityForDiv(element);
            if (visibility > result.visibility) {
                result.element = element;
                result.visibility = visibility;
            }
        });
        return result.element;
    }
    getCurrentPageMeta() {
        let pageElement = Preconditions_1.notNull(this.getCurrentPageElement());
        let pageNum = this.getPageNumFromPageElement(pageElement);
        return { pageElement, pageNum };
    }
    currentDocFingerprint() {
    }
    currentState(event) {
    }
    supportThumbnails() {
        return false;
    }
    textHighlightOptions() {
        return {};
    }
    targetDocument() {
        throw new Error("Not implemented");
    }
    docDetails() {
        return {};
    }
}
exports.DocFormat = DocFormat;
//# sourceMappingURL=DocFormat.js.map