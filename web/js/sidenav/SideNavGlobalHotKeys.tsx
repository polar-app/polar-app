import React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {SIDE_NAV_ENABLED, useSideNavCallbacks} from './SideNavStore';

const globalKeyMap = keyMapWithGroup({
    group: "Side Navigation",
    keyMap: {
        CLOSE_CURRENT_TAB: {
            name: "Close Current Document",
            description: "Close the Current Document Tab",
            sequences: ['shift+ctrl+L', 'shift+command+l']
        },
        PREV_TAB: {
            name: "Jump to Previous Document",
            description: "Jump to Previous Document",
            sequences: ['shift+command+ArrowUp', 'shift+ctrl+ArrowUp']
        },
        NEXT_TAB: {
            name: "Jump to Next Document",
            description: "Jump to Next Document",
            sequences: ['shift+command+ArrowDown', 'shift+ctrl+ArrowDown']
        }
    }
});

export const SideNavGlobalHotKeys = React.memo(function SideNavGlobalHotKeys() {

    const {closeCurrentTab, prevTab, nextTab} = useSideNavCallbacks();

    const globalKeyHandlers = {
        CLOSE_CURRENT_TAB: closeCurrentTab,
        PREV_TAB: prevTab,
        NEXT_TAB: nextTab
    };

    if (! SIDE_NAV_ENABLED) {
        return null;
    }

    return (
        <>
            <GlobalKeyboardShortcuts
                keyMap={globalKeyMap}
                handlerMap={globalKeyHandlers}/>
        </>
    );

});

