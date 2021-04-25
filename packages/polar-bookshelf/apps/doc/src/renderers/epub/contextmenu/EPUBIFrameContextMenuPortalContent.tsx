import {deepMemo} from "../../../../../../web/js/react/ReactUtils";
import {EPUBIFrameWindowEventListener} from "./EPUBIFrameWindowEventListener";
import React from "react";
import {
    computeDocViewerContextMenuOrigin,
    DocViewerMenu,
    IDocViewerContextMenuOrigin
} from "../../../DocViewerMenu";
import {createContextMenu} from "../../../../../repository/js/doc_repo/MUIContextMenu";

const DocViewerContextMenu = createContextMenu<IDocViewerContextMenuOrigin>(DocViewerMenu, {computeOrigin: computeDocViewerContextMenuOrigin});

export const EPUBIFrameContextMenuPortalContent = deepMemo(function EPUBIFrameContextMenuPortalContent() {

    return (
        <DocViewerContextMenu>
            <EPUBIFrameWindowEventListener/>
        </DocViewerContextMenu>
    );

});
