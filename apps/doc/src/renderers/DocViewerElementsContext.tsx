import {useDocViewerContext} from "./DocRenderer";
import {Preconditions} from "polar-shared/src/Preconditions";
import { arrayStream } from "polar-shared/src/util/ArrayStreams";

export interface IDocViewerElements {

    /**
     * Get all the elements for a page including their pageNum.
     */
    getPageElements(): ReadonlyArray<IPageElement>;

    /**
     * Get the element for a page or undefined if it's either not mounted (for
     * EPUB) or an invalid page number.
     */
    getPageElementForPage(pageNum: number): HTMLElement | undefined;

}

/**
 * The page number and element for a page.
 */
export interface IPageElement {
    readonly pageNum: number;
    readonly element: HTMLElement;
}

export function useDocViewerElementsContext(): IDocViewerElements {

    const {docID} = useDocViewerContext();

    function getDocViewerElement(): HTMLElement {
        const selector = `div[data-doc-viewer-id='${docID}']`;
        const element = document.querySelector(selector) as HTMLElement;
        return Preconditions.assertPresent(element, 'getDocViewerElement');
    }

    function getPageElements(): ReadonlyArray<IPageElement> {

        function computeElements(): ReadonlyArray<HTMLElement> {

            const docViewerElement = getDocViewerElement();
            const elements = docViewerElement.querySelectorAll('.page');
            return Array.from(elements) as HTMLElement[];

        }

        function toPageElement(element: HTMLElement): IPageElement {
            const dataPageNumber = element.getAttribute('data-page-number');

            if (! dataPageNumber) {
                throw new Error("No page number");
            }

            const pageNum = parseInt(dataPageNumber);
            return {pageNum, element};

        }

        return computeElements().map(toPageElement);

    }

    function getPageElementForPage(pageNum: number): HTMLElement | undefined {

        return arrayStream(getPageElements())
                .filter(current => current.pageNum === pageNum)
                .map(current => current.element)
                .first()

    }

    return {getPageElements, getPageElementForPage};

}
