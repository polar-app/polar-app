import {useDocViewerContext} from "./DocRenderer";
import {Preconditions} from "polar-shared/src/Preconditions";
import { arrayStream } from "polar-shared/src/util/ArrayStreams";
import {useDocViewerStore} from "../DocViewerStore";

export interface IDocViewerElements {

    getDocViewerElement(): HTMLElement;

    /**
     * Get all the elements for a page including their pageNum.
     */
    getPageDescriptors(): ReadonlyArray<IPageDescriptor>;

    /**
     *
     * Get all HTMLElements for the page.
     */
    getPageElements(): ReadonlyArray<HTMLElement>;

    /**
     * Get the element for a page or undefined if it's either not mounted (for
     * EPUB) or an invalid page number.
     */
    getPageElementForPage(pageNum: number): HTMLElement | undefined;

    /**
     * Get the container from a page element.
     */
    getContainerFromPageElement(pageElement: HTMLElement): HTMLElement | undefined;

}

/**
 * The page number and element for a page.
 */
export interface IPageDescriptor {
    readonly pageNum: number;
    readonly loaded: boolean;
    readonly element: HTMLElement;
}

export function useDocViewerElementsContext(): IDocViewerElements {

    const {docID, fileType} = useDocViewerContext();

    const {page} = useDocViewerStore(['page']);

    function getDocViewerElement(): HTMLElement {
        const selector = `div[data-doc-viewer-id='${docID}']`;
        const element = document.querySelector(selector) as HTMLElement;
        return Preconditions.assertPresent(element, 'getDocViewerElement');
    }

    function getPageDescriptors(): ReadonlyArray<IPageDescriptor> {

        function getPageDescriptorsForPDF() {

            function computeElements(): ReadonlyArray<HTMLElement> {

                const docViewerElement = getDocViewerElement();
                const elements = docViewerElement.querySelectorAll('.page');
                return Array.from(elements) as HTMLElement[];

            }

            function toPageElement(element: HTMLElement): IPageDescriptor {
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

        function getPageDescriptorsForEPUB(): ReadonlyArray<IPageDescriptor> {

            const docViewerElement = getDocViewerElement();
            const pageElement = docViewerElement.querySelector('.page') as HTMLElement;

            if (! pageElement) {
                throw new Error("No pageElement");
            }

            return [
                {
                    pageNum: page,
                    element: pageElement,
                    loaded: true
                }
            ];

        }

        switch (fileType) {

            case "pdf":
                return getPageDescriptorsForPDF();
            case "epub":
                return getPageDescriptorsForEPUB();

        }

    }

    function getPageElements() {
        return getPageDescriptors().map(current => current.element);
    }

    function getPageElementForPage(pageNum: number): HTMLElement | undefined {

        return arrayStream(getPageDescriptors())
                .filter(current => current.pageNum === pageNum)
                .map(current => current.element)
                .first()

    }

    function getContainerFromPageElement(pageElement: HTMLElement): HTMLElement | undefined {

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
                console.warn("useDocViewerElementsContext: No iframe");
                return undefined;
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

    return {
        getDocViewerElement,
        getPageDescriptors,
        getPageElements,
        getPageElementForPage,
        getContainerFromPageElement
    };

}
