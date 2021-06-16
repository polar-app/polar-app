import React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {SIDE_NAV_ENABLED, useSideNavCallbacks} from './SideNavStore';

const globalKeyMap = keyMapWithGroup({
    group: "Side Navigation",
    keyMap: {
        CLOSE_CURRENT_TAB: {
            name: "Close doc",
            description: "Close doc",
            sequences: [
                {
                    keys: 'shift+ctrl+L',
                    platforms: ['windows', 'linux']
                },
                {
                    keys: 'shift+command+l',
                    platforms: ['macos']
                }]
        },
        PREV_TAB: {
            name: "Jump to previous doc",
            description: "Jump to previous doc",
            sequences: [
                {
                    keys: 'shift+command+ArrowUp',
                    platforms: ['macos']
                },
                {
                    keys: 'shift+ctrl+ArrowUp',
                    platforms: ['windows', 'linux']
                }]
        },
        NEXT_TAB: {
            name: "Jump to next doc",
            description: "Jump to next doc",
            sequences: [
                {
                    keys: 'shift+command+ArrowDown',
                    platforms: ['macos']
                },
                {
                    keys: 'shift+ctrl+ArrowDown',
                    platforms: ['windows', 'linux']
                }
            ]
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

