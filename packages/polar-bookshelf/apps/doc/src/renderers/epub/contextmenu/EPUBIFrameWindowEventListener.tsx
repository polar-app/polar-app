import React from 'react';
import {
    MouseEvents,
    useContextMenu
} from "../../../../../repository/js/doc_repo/MUIContextMenu";
import {Callback} from 'polar-shared/src/util/Functions';
import {useDocViewerIFrame} from "./EPUBIFrameHooks";

export const EPUBIFrameWindowEventListener = () => {

    const {onContextMenu} = useContextMenu();
    const iframe = useDocViewerIFrame();

    const handleContextMenu = React.useCallback((event: MouseEvent) => {

        onContextMenu(MouseEvents.fromNativeEvent(event))

    }, [onContextMenu]);

    React.useEffect(() => {

        if (! iframe) {
            console.warn("No iframe");
            return;
        }

        if (! iframe.contentWindow) {
            console.warn("No contentWindow");
            return;
        }

        const source = iframe.contentWindow.document.body;

        if (! source) {
            console.warn("No source");
            return;
        }

        source.addEventListener('contextmenu', handleContextMenu);

        return () => {

            if (source && typeof source.removeEventListener === 'function') {
                source.removeEventListener('contextmenu', handleContextMenu);
            }

        }

    }, [handleContextMenu, iframe]);

    return null;

}
