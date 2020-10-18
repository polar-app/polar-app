import * as React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../keyboard_shortcuts/GlobalKeyboardShortcuts";
import { useDockLayoutCallbacks } from './DockLayoutStore';
import { Callback } from 'polar-shared/src/util/Functions';

const globalKeyMap = keyMapWithGroup({
    group: "Sidebar Panels",
    groupPriority: -1,
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

interface IProps {
    readonly onResize?: Callback;
}

export const DockLayoutGlobalHotKeys = React.memo((props: IProps) => {

    const {toggleSide} = useDockLayoutCallbacks();

    const handleResize = React.useCallback(() => {
        if (props.onResize) {
            props.onResize();
        }
    }, [props]);

    const globalKeyHandlers = {
        TOGGLE_LEFT: () => {
            toggleSide('left');
            handleResize();
        },
        TOGGLE_RIGHT: () => {
            toggleSide('right');
            handleResize();
        },
    };
    return (
        <GlobalKeyboardShortcuts
            keyMap={globalKeyMap}
            handlerMap={globalKeyHandlers}/>
    );

});


