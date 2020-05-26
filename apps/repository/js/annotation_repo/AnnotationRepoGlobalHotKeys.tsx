import {GlobalHotKeys} from "react-hotkeys";
import React from "react";
import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";
import {Callbacks} from "../Callbacks";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {KeyMaps} from "../../../../web/js/hotkeys/KeyMaps";
import keyMap = KeyMaps.keyMap;

const globalKeyMap = keyMap(
    {
        group: "Annotations",
        keyMap: {
            TAG: {
                name: "Tag",
                description: "Tag the current annotation.",
                sequences: ['t'],
            },
            DELETE: {
                name: "Delete",
                description: "Delete the current annotation.",
                sequences: ['del', 'backspace'],
            }
        }
    });

export const AnnotationRepoGlobalHotKeys = React.memo(() => {

    const callbacks = useAnnotationRepoCallbacks();
    
    const globalKeyHandlers = Callbacks.callbacksWithTimeout({
        TAG: callbacks.onTagged,
        DELETE: callbacks.onDeleted,
        // FLAG: callbacks.onFlagged,
        // ARCHIVE: callbacks.onArchived
    });

    return (

        <GlobalHotKeys allowChanges={true}
                       keyMap={globalKeyMap}
                       handlers={globalKeyHandlers}/>

    );

});
