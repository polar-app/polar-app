import React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {SIDE_NAV_ENABLED, useSideNavCallbacks} from './SideNavStore';

const globalKeyMap = keyMapWithGroup({
    group: "Side Navigation",
    keyMap: {
        CLOSE_CURRENT_TAB: {
            name: "Close Current Document",
            description: "Close the Current Document Tab",
            sequences: ['c', 'shift+ctrl+c']
        }

    }
});

export const SideNavGlobalHotKeys = React.memo(() => {

    const {closeCurrentTab} = useSideNavCallbacks();

    const globalKeyHandlers = {
        CLOSE_CURRENT_TAB: closeCurrentTab
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

