import React from 'react';
import {useDocFindCallbacks} from './DocFindStore';
import {useDocViewerCallbacks, useDocViewerStore} from "./DocViewerStore";
import {ReactRouters} from "../../../web/js/react/router/ReactRouters";
import {
    GlobalKeyboardShortcuts,
    keyMapWithGroup
} from "../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;
import {DocViewerAppURLs} from "./DocViewerAppURLs";
import {DockLayoutGlobalHotKeys} from "../../../web/js/ui/doc_layout/DockLayoutGlobalHotKeys";
import {SideNavGlobalHotKeys} from "../../../web/js/sidenav/SideNavGlobalHotKeys";

const globalKeyMap = keyMapWithGroup({
    group: "Document Viewer",
    keyMap: {
        FIND: {
            name: "Find",
            description: "Search within the document for the given text.",
            sequences: ['ctrl+f', 'command+f']
        },
        FIND_NEXT: {
            name: "Find Next Match",
            description: "Jump to the next match in the current search results.",
            sequences: ['ctrl+g', 'command+g']
        },
        PAGE_NEXT: {
            name: "Next Page",
            description: "Jump to the next page",
            sequences: ['n', 'j', 'ArrowRight']
        },
        PAGE_PREV: {
            name: "Previous Page",
            description: "Jump to the previous page",
            sequences: ['p', 'k', 'ArrowLeft']
        },
        ZOOM_IN: {
            name: "Zoom In",
            description: "Zoom in to the current document",
            sequences: ['command+shift+=', 'command+=', 'ctrl+shift+=', 'ctrl+=']
        },
        ZOOM_OUT: {
            name: "Zoom Out",
            description: "Zoom out to the current document",
            sequences: ['command+shift+-', 'command+-', 'ctrl+shift+-', 'ctrl+-']
        },
        ZOOM_RESTORE: {
            name: "Zoom Restore",
            description: "Restore the default zoom level",
            sequences: ['command+0', 'ctrl+0']
        },
        TAG: {
            name: "Tag",
            description: "Tag the current document",
            sequences: ['t']
        },
        FLAG: {
            name: "Flag",
            description: "Flag the current document",
            sequences: ['f']
        },
        ARCHIVE: {
            name: "Archive",
            description: "Archive the current document",
            sequences: ['a']
        },

    }
});

export const DocViewerGlobalHotKeys = React.memo(function DocViewerGlobalHotKeys() {

    const findCallbacks = useDocFindCallbacks();
    const {onPagePrev, onPageNext, doZoom, doZoomRestore, onDocTagged, toggleDocArchived, toggleDocFlagged} = useDocViewerCallbacks();
    const {docMeta} = useDocViewerStore(['docMeta']);

    const globalKeyHandlers = {
        FIND: () => findCallbacks.setActive(true),
        FIND_NEXT: () => findCallbacks.doFindNext(),
        PAGE_NEXT: onPageNext,
        PAGE_PREV: onPagePrev,
        ZOOM_IN: () => doZoom('+'),
        ZOOM_OUT: () => doZoom('-'),
        ZOOM_RESTORE: doZoomRestore,
        TAG: onDocTagged,
        FLAG: toggleDocFlagged,
        ARCHIVE: toggleDocArchived,
    };

    const location = useLocationWithPathOnly();

    const docViewerURL = DocViewerAppURLs.parse(location.pathname)

    return (
        <>
            {docViewerURL && docMeta && docViewerURL.id === docMeta.docInfo.fingerprint && (
                <>
                    <DockLayoutGlobalHotKeys/>

                    <SideNavGlobalHotKeys/>

                    <GlobalKeyboardShortcuts
                        keyMap={globalKeyMap}
                        handlerMap={globalKeyHandlers}/>
                </>
            )}
        </>
    );

});

