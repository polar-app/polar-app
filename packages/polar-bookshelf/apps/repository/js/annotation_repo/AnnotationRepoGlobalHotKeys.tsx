import {GlobalHotKeys} from "react-hotkeys";
import React from "react";
import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";
import {KeyMaps} from "../../../../web/js/hotkeys/KeyMaps";
import {HotKeyCallbacks} from "../../../../web/js/hotkeys/HotKeyCallbacks";
import {KeyHandlers} from "../../../../web/js/hotkeys/KeyHandlers";
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
    
    const globalKeyHandlers = KeyHandlers.withDefaultBehavior({
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
