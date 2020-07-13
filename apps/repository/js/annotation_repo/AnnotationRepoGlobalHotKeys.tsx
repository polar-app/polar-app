import {GlobalHotKeys} from "react-hotkeys";
import React from "react";
import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";
import {TimeoutCallbacks} from "../../../../web/js/hotkeys/TimeoutCallbacks";
import {KeyMaps} from "../../../../web/js/hotkeys/KeyMaps";
import keyMap = KeyMaps.keyMap;
import {HotKeyCallbacks} from "../../../../web/js/hotkeys/HotKeyCallbacks";

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
    
    const globalKeyHandlers = TimeoutCallbacks.callbacksWithTimeout({
        TAG: HotKeyCallbacks.withPreventDefault(callbacks.onTagged),
        DELETE: HotKeyCallbacks.withPreventDefault(callbacks.onDeleted),
        // FLAG: callbacks.onFlagged,
        // ARCHIVE: callbacks.onArchived
    });

    return (

        <GlobalHotKeys allowChanges={true}
                       keyMap={globalKeyMap}
                       handlers={globalKeyHandlers}/>

    );

});
