import * as React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from '../keyboard_shortcuts/GlobalKeyboardShortcuts';
import { useZenModeCallbacks } from './ZenModeStore';

const globalKeyMap = keyMapWithGroup({
    group: "Zen Mode",
    groupPriority: -1,
    keyMap: {

        TOGGLE_ZEN_MODE: {
            icon: <MenuIcon/>,
            name: "Toggle Zen Mode",
            description: "Toggle 'zen' mode by hiding extra navigation items like toolbars, side navigation, etc.",
            sequences: ['F9']
        },

    }
});

export const ZenModeGlobalHotKeys = React.memo(function ZenModeGlobalHotKeys() {

    const {toggleZenMode} = useZenModeCallbacks();

    const globalKeyHandlers = {
        TOGGLE_ZEN_MODE: toggleZenMode,
    };
    return (
        <GlobalKeyboardShortcuts
            keyMap={globalKeyMap}
            handlerMap={globalKeyHandlers}/>
    );

});


