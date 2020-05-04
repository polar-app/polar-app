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

    // FIXME: use this with all function hooks now...
    function callbackExecutedWithTimeout(delegate: () => void): () => void {
        // for some reason when I try to autotag the input is automatically
        // filled with a 't'.  react-hotkeys isn supposed to stop propagation
        // by default but that seems to not be functional.
        return () => {
            setTimeout(delegate, 1);
        }
    }

    const globalKeyHandlers = {
        TAG: callbackExecutedWithTimeout(callbacks.onTagged),
        DELETE: callbackExecutedWithTimeout(callbacks.onDeleted),
        // FLAG: callbacks.onFlagged,
        // ARCHIVE: callbacks.onArchived
    };

    return (

        <GlobalHotKeys allowChanges={true}
                       keyMap={globalKeyMap}
                       handlers={globalKeyHandlers}/>

    );

});
