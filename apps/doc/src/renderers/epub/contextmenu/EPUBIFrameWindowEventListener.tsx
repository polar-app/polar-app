import React from 'react';
import {
    MouseEvents,
    useContextMenu
} from "../../../../../repository/js/doc_repo/MUIContextMenu";
import {Callback} from 'polar-shared/src/util/Functions';
import {useDocViewerStore} from '../../../DocViewerStore';
import {useDocViewerElementsContext} from "../../DocViewerElementsContext";

// FIXME: rework the iframe context to just use this method...
function useDocViewerIFrame() {

    const docViewerElementsContext = useDocViewerElementsContext();

    // used so we update on each page...
    useDocViewerStore(['page']);

    const docViewerElement = docViewerElementsContext.getDocViewerElement();
    return docViewerElement.querySelector('iframe');

}

export const EPUBIFrameWindowEventListener = () => {

    const {onContextMenu} = useContextMenu();
    const iframe = useDocViewerIFrame();

    const unsubscriber = React.useRef<Callback | undefined>(undefined);

    const handleContextMenu = React.useCallback((event: MouseEvent) => {
        onContextMenu(MouseEvents.fromNativeEvent(event))
    }, []);

    React.useEffect(() => {

        if (unsubscriber.current) {
            unsubscriber.current();
        }

        if (! iframe) {
            throw new Error("No iframe");
        }

        const win = iframe.contentWindow;

        if (! win) {
            throw new Error("No window for iframe");
        }

        win.addEventListener('contextmenu', handleContextMenu);

        unsubscriber.current = () => win.removeEventListener('contextmenu', handleContextMenu);

    });

    return null;

}
