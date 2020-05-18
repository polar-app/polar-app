import {GlobalHotKeys} from "react-hotkeys";
import React from "react";
import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";
import {Callbacks} from "../Callbacks";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;

const globalKeyMap = {
    TAG: 't',
    DELETE: ['del', 'backspace'],
    // FLAG: 'f',
    // ARCHIVE: 'a'
};

export const AnnotationRepoGlobalHotKeys = React.memo(() => {

    const callbacks = useAnnotationRepoCallbacks();
    
    const globalKeyHandlers = Callbacks.callbacksWithTimeout({
        TAG: callbacks.onTagged,
        DELETE: callbacks.onDeleted,
        // FLAG: callbacks.onFlagged,
        // ARCHIVE: callbacks.onArchived
    });

    const location = useLocationWithPathOnly();

    return (

        <BrowserRouter>
            <Switch location={location}>

                <Route exact path='/annotations'>
                    <GlobalHotKeys allowChanges={true}
                                   keyMap={globalKeyMap}
                                   handlers={globalKeyHandlers}/>

                </Route>

            </Switch>
        </BrowserRouter>

    );

});
