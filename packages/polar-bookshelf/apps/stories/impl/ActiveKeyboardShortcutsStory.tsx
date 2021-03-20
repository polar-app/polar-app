import * as React from 'react';
import {ActiveKeyboardShortcutsDialog} from "../../../web/js/hotkeys/ActiveKeyboardShortcuts";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";


export const ActiveKeyboardShortcutsStory = () => {
    return (
        <ActiveKeyboardShortcutsDialog onClose={NULL_FUNCTION}/>
    )
}