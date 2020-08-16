import {deepMemo} from "../../web/js/react/ReactUtils";
import React from "react";
import {createQuerySelector} from "./QuerySelector";
import {EPUBContextMenuFinderContext} from "./EPUBContextMenuFinderContext";

const EPUBIFrameQuerySelector = createQuerySelector<HTMLIFrameElement>();

export const EPUBContextMenuRoot = deepMemo(() => {

    return (
        <EPUBIFrameQuerySelector component={EPUBContextMenuFinderContext}
                                 selector={() => document.querySelector('iframe')}/>
    );
});
