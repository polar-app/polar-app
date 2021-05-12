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
import {MAIN_HIGHLIGHT_COLORS} from "../../../web/js/ui/ColorMenu";
import {useRefWithUpdates} from "../../../web/js/hooks/ReactHooks";

const globalKeyMap = keyMapWithGroup({
    group: "Document Viewer",
    keyMap: {
        FIND: {
            name: "Find",
            description: "Search text",
            sequences: ['ctrl+f', 'command+f']
        },
        FIND_NEXT: {
            name: "Find Next Match",
            description: "Next match",
            sequences: ['ctrl+g', 'command+g']
        },
        PAGE_NEXT: {
            name: "Next Page",
            description: "Jump to next page",
            sequences: ['n', 'j', 'ArrowRight']
        },
        PAGE_PREV: {
            name: "Previous Page",
            description: "Jump to previous page",
            sequences: ['p', 'k', 'ArrowLeft']
        },
        ZOOM_IN: {
            name: "Zoom In",
            description: "Zoom in",
            sequences: ['command+shift+=', 'command+=', 'ctrl+shift+=', 'ctrl+=']
        },
        ZOOM_OUT: {
            name: "Zoom Out",
            description: "Zoom out",
            sequences: ['command+shift+-', 'command+-', 'ctrl+shift+-', 'ctrl+-']
        },
        ZOOM_RESTORE: {
            name: "Zoom Restore",
            description: "Restore default zoom",
            sequences: ['command+0', 'ctrl+0']
        },
        TAG: {
            name: "Tag",
            description: "Tag doc",
            sequences: ['t']
        },
        FLAG: {
            name: "Flag",
            description: "Flag doc",
            sequences: ['f']
        },
        ARCHIVE: {
            name: "Archive",
            description: "Archive doc",
            sequences: ['a']
        },
        TEXT_HIGHLIGHT_MODE: {
            name: "Text Highlight Mode",
            description: "Toggle text highlight mode",
            sequences: ['v'],
        }

    }
});

export const DocViewerGlobalHotKeys = React.memo(function DocViewerGlobalHotKeys() {

    const findCallbacks = useDocFindCallbacks();
    const {onPagePrev, onPageNext, doZoom, doZoomRestore, onDocTagged, toggleDocArchived, toggleDocFlagged, setTextHighlightColor} = useDocViewerCallbacks();
    const {docMeta, textHighlightColor} = useDocViewerStore(['docMeta', 'textHighlightColor']);
    const toggleTextHighlightMode = useRefWithUpdates(() => setTextHighlightColor(textHighlightColor ? undefined : MAIN_HIGHLIGHT_COLORS[0]));

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
        TEXT_HIGHLIGHT_MODE: () => toggleTextHighlightMode.current(),
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

