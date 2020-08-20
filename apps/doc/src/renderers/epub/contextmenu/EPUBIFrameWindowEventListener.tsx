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

    const unsubscriber = React.useRef<Callback | undefined>(undefined);

    const handleContextMenu = React.useCallback((event: MouseEvent) => {
        onContextMenu(MouseEvents.fromNativeEvent(event))
    }, []);

    React.useEffect(() => {

        if (unsubscriber.current) {
            unsubscriber.current();
        }

        if (! iframe) {
            console.warn("No iframe");
            return;
        }

        const source = iframe.contentWindow?.document.body;

        if (! source) {
            console.warn("No window for iframe");
            return;
        }

        source.addEventListener('contextmenu', handleContextMenu);

        unsubscriber.current = () => source.removeEventListener('contextmenu', handleContextMenu);

    });

    return null;

}
