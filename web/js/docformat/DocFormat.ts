import {notNull, Preconditions} from '../Preconditions';
import {Elements} from '../util/Elements';
import {DocDetails} from '../metadata/DocDetails';

/**
 * Get the proper docFormat to work with.
 */
export class DocFormat {

    currentScale() {
        return 1.0;
    }

    getPageNumFromPageElement(pageElement: HTMLElement) {
        Preconditions.assertNotNull(pageElement, "pageElement");
        let dataPageNum = notNull(pageElement.getAttribute("data-page-number"));
        return parseInt(dataPageNum);
    }

    getPageElementFromPageNum(pageNum: number) {

        if(!pageNum) {
            throw new Error("Page number not specified");
        }

        let pageElements = document.querySelectorAll(".page");

        // note that elements are 0 based indexes but our pages are 1 based
        // indexes.
        let pageElement = pageElements[pageNum - 1];

        if(! pageElement) {
            throw new Error("Unable to find page element for page num: " + pageNum);
        }

        return pageElement;

    }

    /**
     * Get the current page number based on which page is occupying the largest
     * percentage of the viewport.
     */
    getCurrentPageElement(): HTMLElement | null {

        let pageElements = document.querySelectorAll(".page");

        if(pageElements.length === 1) {

            // if we only have one page, just go with that as there are no other
            // options.  This was added to avoid a bug in calculate visibility
            // but it works.
            return pageElements[0] as HTMLElement;

        }

        let result = <CurrentPageElement> {
            element: null,
            visibility: 0
        };

        pageElements.forEach(pageElement => {

            let element = <HTMLElement>pageElement;

            let visibility = Elements.calculateVisibilityForDiv(element);

            if ( visibility > result.visibility) {
                result.element = element;
                result.visibility = visibility;

            }

        });

        return result.element;

    }

    /**
     * Get all the metadata about the current page.
     */
    getCurrentPageMeta() {

        let pageElement = notNull(this.getCurrentPageElement());
        let pageNum = this.getPageNumFromPageElement(pageElement);

        return { pageElement, pageNum }

    }

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    currentDocFingerprint() {

    }

    /**
     * Get the current state of the doc.
     */
    currentState(event: any) {

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

    docDetails(): DocDetails {
        return { }
    }

}

interface CurrentPageElement {
    element: HTMLElement | null;
    visibility: number;
}
