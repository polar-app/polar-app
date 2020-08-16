import {deepMemo} from "../../web/js/react/ReactUtils";
import {IFrameContextMenu} from "./IFrameContextMenu";
import {EPUBIFrameWindowEventListener} from "./EPUBIFrameWindowEventListener";
import React from "react";

export const EPUBIFrameContextMenuPortalContent = deepMemo(() => (
    <IFrameContextMenu>
        <EPUBIFrameWindowEventListener/>
    </IFrameContextMenu>
));
