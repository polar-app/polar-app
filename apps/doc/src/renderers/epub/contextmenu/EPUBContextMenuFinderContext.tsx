import {EPUBIFrameContextProvider} from "./EPUBIFrameContext";
import {EPUBIFrameMenuPortal} from "./EPUBIFrameMenuPortal";
import React from "react";

interface EPUBContextMenuFinderContextProps {
    readonly element: HTMLIFrameElement;
}

// TODO: make this a memo so it can never re-render
export const EPUBContextMenuFinderContext = (props: EPUBContextMenuFinderContextProps) => {

    return (
        <EPUBIFrameContextProvider element={props.element}>
            <EPUBIFrameMenuPortal/>
        </EPUBIFrameContextProvider>
    );

};
