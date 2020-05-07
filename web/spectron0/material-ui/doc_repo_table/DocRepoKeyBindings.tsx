import React from "react";
import {Callbacks} from "../../../../apps/repository/js/Callbacks";
import {GlobalHotKeys} from "react-hotkeys";
import {useDocRepoCallbacks} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";

const globalKeyMap = {
    TAG: 't',
    DELETE: ['del', 'backspace'],
    FLAG: 'f',
    ARCHIVE: 'a',
    RENAME: 'r',
    OPEN: ['command+return', 'control+return']
};

export const DocRepoKeyBindings = React.memo(() => {

    const callbacks = useDocRepoCallbacks();

    const globalKeyHandlers = Callbacks.callbacksWithTimeout({
        TAG: callbacks.onTagged,
        DELETE: callbacks.onDeleted,
        FLAG: callbacks.onFlagged,
        ARCHIVE: callbacks.onArchived,
        RENAME: callbacks.onRename,
        OPEN: callbacks.onOpen
    });

    return (

        <GlobalHotKeys allowChanges={true}
                       keyMap={globalKeyMap}
                       handlers={globalKeyHandlers}/>

    );

});
