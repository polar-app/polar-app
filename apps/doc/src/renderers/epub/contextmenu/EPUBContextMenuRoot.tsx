import {deepMemo} from "../../../../../../web/js/react/ReactUtils";
import React from "react";
import {createQuerySelector} from "../../../../../dev2/QuerySelector";
import {EPUBContextMenuFinderContext} from "./EPUBContextMenuFinderContext";
import {useDocViewerElementsContext} from "../../DocViewerElementsContext";
import {useDocViewerStore} from "../../../DocViewerStore";

const EPUBIFrameQuerySelector = createQuerySelector<HTMLIFrameElement>();

export const EPUBContextMenuRoot = deepMemo(function EPUBContextMenuRoot() {

    const docViewerElementsContext = useDocViewerElementsContext();

    // used so we update on each page...
    useDocViewerStore(['page']);

    function selector() {
        const docViewerElement = docViewerElementsContext.getDocViewerElement();
        return docViewerElement.querySelector('iframe');
    }

    return (
        <EPUBIFrameQuerySelector component={EPUBContextMenuFinderContext}
                                 selector={selector}/>
    );

});
