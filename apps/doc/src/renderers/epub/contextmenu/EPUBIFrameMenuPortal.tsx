import {deepMemo} from "../../../../../../web/js/react/ReactUtils";
import {useEPUBIFrameContext} from "./EPUBIFrameContext";
import ReactDOM from "react-dom";
import {EPUBIFrameContextMenuPortalContent} from "./EPUBIFrameContextMenuPortalContent";
import React from "react";

export const EPUBIFrameMenuPortal = deepMemo(function EPUBIFrameMenuPortal() {
    const iframe = useEPUBIFrameContext();
    return ReactDOM.createPortal(<EPUBIFrameContextMenuPortalContent/>, iframe.contentDocument!.body);
});
