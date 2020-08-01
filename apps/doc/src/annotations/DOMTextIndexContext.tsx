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
export function useDOMTextIndexContext() {
    return React.useContext(DOMTextIndexContext);
}

interface IProps {
    readonly children: React.ReactNode;
}

export const DOMTextIndexProvider = React.memo((props: IProps) => {

    const docViewerElementsContext = useDocViewerElementsContext();
    const {page} = useDocViewerStore(['page']);
    const indexRef = React.useRef<IDOMTextIndexContent | undefined>();

    const docViewerElement = docViewerElementsContext.getDocViewerElement();

    if (indexRef.current === undefined || indexRef.current.page !== page) {

        function computeIndex() {

            // TODO this would be specific to epub...
            const iframe = docViewerElement.querySelector('iframe');

            if (! iframe) {
                throw new Error("No iframe");
            }
            const doc = iframe.contentDocument!;
            const root = doc.body;

            console.log("Computing DOMTextIndex for page: " + page);

            const index = DOMTextSearch.createIndex(doc, root);

            return {page, index};

        }

        indexRef.current = computeIndex();

    }

    return (
        <DOMTextIndexContext.Provider value={indexRef.current}>
            {props.children}
        </DOMTextIndexContext.Provider>
    );

});
