import React from "react";
import {Callbacks} from "../../../../apps/repository/js/Callbacks";
import {GlobalHotKeys, KeyMap} from "react-hotkeys";
import {useDocRepoCallbacks} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../js/react/router/ReactRouters";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;
import {KeyMaps} from "../../../js/hotkeys/KeyMaps";
import keyMap = KeyMaps.keyMap;

const globalKeyMap = keyMap({
    TAG: {
        name: "Tag",
        description: "Tag the currently selected document.",
        sequences: ['t'],
    },
    DELETE: {
        name: "Delete",
        description: "Delete the currently selected item.",
        sequences: ['del', 'backspace'],
    },
    FLAG: {
        name: "Flag",
        description: "Flag the currently selected document",
        sequences: ['f']
    },
    ARCHIVE: {
        name: "Archive",
        description: "Archive the currently selected document.  Once archived the item is not visible by default.",
        sequences: ['a']
    },
    RENAME: {
        name: "Rename",
        description: "Rename the current document and assign it a new title.",
        sequences: ['r']
    },
    OPEN: {
        name: "Open",
        description: "Open the current document in the document viewer",
        sequences: ['command+return', 'control+return']
    }
});

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
