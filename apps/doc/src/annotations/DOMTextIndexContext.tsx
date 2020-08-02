import React from "react";
import {useDocViewerElementsContext} from "../renderers/DocViewerElementsContext";
import {DOMTextIndex} from "polar-dom-text-search/src/DOMTextIndex";
import {DOMTextSearch} from "polar-dom-text-search/src/DOMTextSearch";
import { useDocViewerStore } from "../DocViewerStore";

interface IDOMTextIndexContent {
    readonly page: number;
    readonly index: DOMTextIndex;
}

const DOMTextIndexContext = React.createContext<IDOMTextIndexContent>(null!);

/**
 * Get the DOMTextIndex for the current page.
 */
export function useDOMTextIndexContext(): IDOMTextIndexContent {
    return React.useContext(DOMTextIndexContext);
}

interface IProps {
    readonly children: React.ReactNode;
}


function computeIndex(page: number, docViewerElement: HTMLElement) {

    // TODO this would be specific to epub...
    const iframe = docViewerElement.querySelector('iframe');

    if (! iframe) {
        throw new Error("No iframe");
    }
    const doc = iframe.contentDocument!;
    const root = doc.body;

    const index = DOMTextSearch.createIndex(doc, root);

    return {page, index};

}

export const DOMTextIndexProvider = React.memo((props: IProps) => {

    const docViewerElementsContext = useDocViewerElementsContext();
    const {page} = useDocViewerStore(['page']);
    const [index, setIndex] = React.useState<IDOMTextIndexContent | undefined>()

    if (index === undefined || index.page !== page) {
        const docViewerElement = docViewerElementsContext.getDocViewerElement();
        setIndex(computeIndex(page, docViewerElement));
        return null;
    }

    return (
        <DOMTextIndexContext.Provider value={index!}>
            {props.children}
        </DOMTextIndexContext.Provider>
    );

});
