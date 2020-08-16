import {deepMemo} from "../../../../../../web/js/react/ReactUtils";
import React from "react";
import {createQuerySelector} from "../../../../../dev2/QuerySelector";
import {EPUBContextMenuFinderContext} from "./EPUBContextMenuFinderContext";
import {useDocViewerElementsContext} from "../../DocViewerElementsContext";

const EPUBIFrameQuerySelector = createQuerySelector<HTMLIFrameElement>();

export const EPUBContextMenuRoot = deepMemo(() => {

    const docViewerElementsContext = useDocViewerElementsContext();

    function selector() {
        const docViewerElement = docViewerElementsContext.getDocViewerElement();
        return docViewerElement.querySelector('iframe');
    }

    return (
        <EPUBIFrameQuerySelector component={EPUBContextMenuFinderContext}
                                 selector={selector}/>
    );

});
