import React from "react";
import {Callbacks} from "../../../../apps/repository/js/Callbacks";
import {GlobalHotKeys} from "react-hotkeys";
import {useDocRepoCallbacks} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../js/react/router/ReactRouters";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;

const globalKeyMap = {
    TAG: 't',
    DELETE: ['del', 'backspace'],
    FLAG: 'f',
    ARCHIVE: 'a',
    RENAME: 'r',
    OPEN: ['command+return', 'control+return']
};

export const DocRepoGlobalHotKeys = React.memo(() => {

    const callbacks = useDocRepoCallbacks();

    const globalKeyHandlers = Callbacks.callbacksWithTimeout({
        TAG: callbacks.onTagged,
        DELETE: callbacks.onDeleted,
        FLAG: callbacks.onFlagged,
        ARCHIVE: callbacks.onArchived,
        RENAME: callbacks.onRename,
        OPEN: callbacks.onOpen
    });

    const location = useLocationWithPathOnly();

    return (

        <BrowserRouter>
            <Switch location={location}>

                <Route exact path='/'>
                    <GlobalHotKeys allowChanges={true}
                                   keyMap={globalKeyMap}
                                   handlers={globalKeyHandlers}/>
                </Route>

            </Switch>
        </BrowserRouter>

    );

});
