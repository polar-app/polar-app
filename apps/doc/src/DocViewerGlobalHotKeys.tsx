import React from 'react';
import {GlobalHotKeys} from "react-hotkeys";
import {useDocFindCallbacks} from './DocFindStore';
import {useDocViewerCallbacks} from "./DocViewerStore";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../web/js/react/router/ReactRouters";
import {KeyMaps} from "../../../web/js/hotkeys/KeyMaps";
import {KeyHandlers} from "../../../web/js/hotkeys/KeyHandlers";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;
import keyMap = KeyMaps.keyMap;

const globalKeyMap = keyMap({
    group: "Document Viewer",
    keyMap: {
        FIND: {
            name: "Find",
            description: "Search within the document for the given text.",
            sequences: ['command+f', 'control+f']
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
        }
    }
});

export const DocViewerGlobalHotKeys = React.memo(() => {

    const findCallbacks = useDocFindCallbacks();
    const {onPagePrev, onPageNext} = useDocViewerCallbacks();

    const globalKeyHandlers = KeyHandlers.withDefaultBehavior<KeyboardEvent | undefined>({
        FIND: () => findCallbacks.setActive(true),
        PAGE_NEXT: onPageNext,
        PAGE_PREV: onPagePrev
    });

    const location = useLocationWithPathOnly();

    return (
        <BrowserRouter>
            <Switch location={location}>

                <Route path={['/pdf', '/doc']}>
                    <GlobalHotKeys allowChanges={true}
                                   keyMap={globalKeyMap}
                                   handlers={globalKeyHandlers}/>
                </Route>
            </Switch>
        </BrowserRouter>
    );

});

