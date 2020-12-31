import * as React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../keyboard_shortcuts/GlobalKeyboardShortcuts";
import { useDockLayoutCallbacks } from './DockLayoutStore';
import MenuIcon from '@material-ui/icons/Menu';

const globalKeyMap = keyMapWithGroup({
    group: "Sidebar Panels",
    groupPriority: -1,
    keyMap: {

        TOGGLE_LEFT: {
            icon: <MenuIcon/>,
            name: "Toggle Left Sidebar Visibility",
            description: "Hide/show the left sidebar",
            sequences: ['[']
        },

        TOGGLE_RIGHT: {
            icon: <MenuIcon/>,
            name: "Toggle Right Sidebar Visibility",
            description: "Hide/show the right sidebar",
            sequences: [']']
        },

    }
});

export const DockLayoutGlobalHotKeys = React.memo(function DockLayoutGlobalHotKeys() {

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


