import {deepMemo} from "../../../../../../web/js/react/ReactUtils";
import {EPUBIFrameContextMenu} from "./EPUBIFrameContextMenu";
import {EPUBIFrameWindowEventListener} from "./EPUBIFrameWindowEventListener";
import React from "react";

export const EPUBIFrameContextMenuPortalContent = deepMemo(() => {

    return (
        <EPUBIFrameContextMenu>
            <EPUBIFrameWindowEventListener/>
        </EPUBIFrameContextMenu>
    );

});
