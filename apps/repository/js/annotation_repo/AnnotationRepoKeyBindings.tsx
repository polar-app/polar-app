import {GlobalHotKeys} from "react-hotkeys";
import React from "react";
import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";

const globalKeyMap = {
    TAG: 't',
    DELETE: ['del', 'backspace'],
    // FLAG: 'f',
    // ARCHIVE: 'a'
};

export const AnnotationRepoKeyBindings = React.memo(() => {

    const callbacks = useAnnotationRepoCallbacks();

    const globalKeyHandlers = {
        TAG: callbacks.onTagged,
        DELETE: callbacks.onDeleted,
        // FLAG: callbacks.onFlagged,
        // ARCHIVE: callbacks.onArchived
    };

    return (

        <GlobalHotKeys allowChanges={true}
                       keyMap={globalKeyMap}
                       handlers={globalKeyHandlers}/>

    );

});
