import {deepMemo} from "../../../../../../web/js/react/ReactUtils";
import {EPUBIFrameWindowEventListener} from "./EPUBIFrameWindowEventListener";
import React from "react";
import {computeDocViewerContextMenuOrigin, DocViewerMenu, IDocViewerContextMenuOrigin} from "../../../DocViewerMenu";
import {createContextMenu} from "../../../../../repository/js/doc_repo/MUIContextMenu";
import {Devices} from 'polar-shared/src/util/Devices';

const DocViewerContextMenu = createContextMenu<IDocViewerContextMenuOrigin>(DocViewerMenu, {computeOrigin: computeDocViewerContextMenuOrigin});

export const EPUBIFrameContextMenuPortalContent = deepMemo(function EPUBIFrameContextMenuPortalContent() {
    
    if(Devices.isDesktop()){
        return (
            <DocViewerContextMenu>
                <EPUBIFrameWindowEventListener/>
            </DocViewerContextMenu>
        );
    } else {
        return <EPUBIFrameWindowEventListener/>;
    }

});
