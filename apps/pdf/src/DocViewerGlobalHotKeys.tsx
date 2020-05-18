import React from 'react';
import {Callbacks} from "../../repository/js/Callbacks";
import {GlobalHotKeys} from "react-hotkeys";
import {useDocFindCallbacks} from './DocFindStore';
import {useDocViewerCallbacks} from "./DocViewerStore";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../web/js/react/router/ReactRouters";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;

const globalKeyMap = {
    FIND: ['command+f', 'control+f'],
    PAGE_NEXT: ['n', 'j'],
    PAGE_PREV: ['p', 'k']
};

export const DocViewerGlobalHotKeys = React.memo(() => {

    const callbacks = useDocFindCallbacks();
    const {onPagePrev, onPageNext} = useDocViewerCallbacks();

    const globalKeyHandlers = Callbacks.callbacksWithTimeout({
        FIND: () => callbacks.setActive(true),
        PAGE_NEXT: onPageNext,
        PAGE_PREV: onPagePrev
    });

    const location = useLocationWithPathOnly();

    return (
        <BrowserRouter>
            <Switch location={location}>

                <Route exact path={['/pdf', '/doc']}>
                    <GlobalHotKeys allowChanges={true}
                                   keyMap={globalKeyMap}
                                   handlers={globalKeyHandlers}/>
                </Route>
            </Switch>
        </BrowserRouter>
    );

});
