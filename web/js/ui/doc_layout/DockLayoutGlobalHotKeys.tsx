import * as React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../keyboard_shortcuts/GlobalKeyboardShortcuts";
import { useDockLayoutCallbacks } from './DockLayoutStore';

const globalKeyMap = keyMapWithGroup({
    group: "Sidebar Panels",
    keyMap: {

        TOGGLE_LEFT: {
            name: "Toggle Left Sidebar Visibility",
            description: "Hide/show the left sidebar",
            sequences: ['[']
        },

        TOGGLE_RIGHT: {
            name: "Toggle Right Sidebar Visibility",
            description: "Hide/show the right sidebar",
            sequences: [']']
        },

    }
});

export const DockLayoutGlobalHotKeys = React.memo(() => {

    const {toggleSide} = useDockLayoutCallbacks();

    const globalKeyHandlers = {
        TOGGLE_LEFT: () => toggleSide('left'),
        TOGGLE_RIGHT: () => toggleSide('right'),
    };
    return (
        <GlobalKeyboardShortcuts
            keyMap={globalKeyMap}
            handlerMap={globalKeyHandlers}/>
    );

});


