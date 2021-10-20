import React from "react";
import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {KeyboardShortcutHandlers} from "../../../../web/js/keyboard_shortcuts/KeyboardShortcutHandlers";

const globalKeyMap = keyMapWithGroup(
    {
        group: "Annotations",
        keyMap: {
            TAG: {
                name: "Tag",
                description: "Tag the current annotation.",
                sequences: [
                    {
                        keys: 't',
                        platforms: ['macos', 'linux', 'windows']
                    },
                ],
            },
            DELETE: {
                name: "Delete",
                description: "Delete the current annotation.",
                sequences: [
                    {
                        keys: 'Delete',
                        platforms: ['macos', 'linux', 'windows']
                    },
                    {
                        keys: 'Backspace',
                        platforms: ['macos', 'linux', 'windows']
                    }
                ],
            }
        }
    });

export const AnnotationRepoGlobalHotKeys = React.memo(function AnnotationRepoGlobalHotKeys() {

    const callbacks = useAnnotationRepoCallbacks();

    const globalKeyHandlers = {
        TAG: KeyboardShortcutHandlers.withPreventDefault(callbacks.onTagged),
        DELETE: KeyboardShortcutHandlers.withPreventDefault(callbacks.onDeleted),
        // FLAG: callbacks.onFlagged,
        // ARCHIVE: callbacks.onArchived
    };

    return (

        <GlobalKeyboardShortcuts keyMap={globalKeyMap}
                                 handlerMap={globalKeyHandlers}/>

    );

});
