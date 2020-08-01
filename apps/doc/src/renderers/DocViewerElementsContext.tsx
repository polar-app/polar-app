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

    /**
     * Get the container from a page element.
     */
    getContainerFromPageElement(pageElement: HTMLElement): HTMLElement;

}

/**
 * The page number and element for a page.
 */
export interface IPageElement {
    readonly pageNum: number;
    readonly loaded: boolean;
    readonly element: HTMLElement;
}

export function useDocViewerElementsContext(): IDocViewerElements {

    const {docID, fileType} = useDocViewerContext();

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

            const loaded = element.getAttribute('data-loaded') === 'true';
            const pageNum = parseInt(dataPageNumber);
            return {pageNum, element, loaded};

        }

        return computeElements().map(toPageElement);

    }

    function getPageElementForPage(pageNum: number): HTMLElement | undefined {

        return arrayStream(getPageElements())
                .filter(current => current.pageNum === pageNum)
                .map(current => current.element)
                .first()

    }

    function getContainerFromPageElement(pageElement: HTMLElement): HTMLElement {

        function containerForPDF() {

            const textLayerElement = pageElement.querySelector(".textLayer");

            if (! textLayerElement) {
                return pageElement;
            }

            return textLayerElement as HTMLElement;

        }

        function containerForEPUB() {
            const docViewerElement = getDocViewerElement();
            const iframe = docViewerElement.querySelector('iframe');

            if (! iframe) {
                throw new Error("No iframe");
            }

            return iframe!.contentDocument!.body;
        }

        switch (fileType) {

            case "pdf":
                return containerForPDF();

            case "epub":
                return containerForEPUB();

        }

    }

    return {getPageElements, getPageElementForPage, getContainerFromPageElement};

}
