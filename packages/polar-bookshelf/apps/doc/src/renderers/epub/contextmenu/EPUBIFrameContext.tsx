import React from "react";
import {deepMemo} from "../../../../../../web/js/react/ReactUtils";

// TODO make this into a simple/static context style injector that I can
// create in one function call without all the needless setup.

const EPUBIFrameContext = React.createContext<HTMLIFrameElement>(null!);

interface IProps {
    readonly element: HTMLIFrameElement;
    readonly children: React.ReactNode;
}

export function useEPUBIFrameContext() {
    return React.useContext(EPUBIFrameContext);
}

/**
 * Provides the context for the EPUB iframe that's being used.
 */
export const EPUBIFrameContextProvider = deepMemo((props: IProps) => (
    <EPUBIFrameContext.Provider value={props.element}>
        {props.children}
    </EPUBIFrameContext.Provider>
));
