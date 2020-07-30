import {useDocViewerContext} from "./DocRenderer";
import {Preconditions} from "polar-shared/src/Preconditions";

export interface IDocViewerElements {
    getPageElements(): ReadonlyArray<HTMLElement>;
    getPageElementForPage(pageNum: number): HTMLElement;
}

export function useDocViewerElementsContext(): IDocViewerElements {

    const {docID} = useDocViewerContext();

    function getDocViewerElement() {
        const selector = `div[data-doc-viewer-id='${docID}']`;
        const element = document.querySelector(selector) as HTMLElement;
        return Preconditions.assertPresent(element, 'getDocViewerElement');
    }

    function getPageElements(): ReadonlyArray<HTMLElement> {
        const docViewerElement = getDocViewerElement();
        const elements = docViewerElement.querySelectorAll('.page');
        return Array.from(elements) as HTMLElement[];
    }

    function getPageElementForPage(pageNum: number): HTMLElement {
        return getPageElements()[pageNum - 1];
    }

    return {getPageElements, getPageElementForPage};

}
