import * as React from 'react';
import { keyMapWithGroup, GlobalKeyboardShortcuts } from '../keyboard_shortcuts/GlobalKeyboardShortcuts';
import { useUndoCallbacks } from './UndoStore';
import {useLogger} from "../mui/MUILogger";

const globalKeyMap = keyMapWithGroup({
    group: "Undo",
    groupPriority: -1,
    keyMap: {

        UNDO: {
            name: "Undo",
            description: "Undo the last action",
            sequences: ['ctrl+z', 'command+Z']
        },

        REDO: {
            name: "Redo",
            description: "Redo the last action",
            sequences: ['shift+ctrl+z', 'shift+command+Z']
        },

    }
});

export const UndoQueueGlobalHotKeys = React.memo(() => {

    const {undo, redo} = useUndoCallbacks();

    const log = useLogger();

    const handleUndo = React.useCallback(async (event: KeyboardEvent) => {
        try {
            await undo();
        } catch (e) {
            log.error("Could not handle undo: ", e);
        }
    }, [log, undo]);

    const handleRedo = React.useCallback(async (event: KeyboardEvent) => {
        try {
            await redo();
        } catch (e) {
            log.error("Could not handle redo: ", e);
        }
    }, [log, redo]);

    const globalKeyHandlers = {
        UNDO: handleUndo,
        REDO: handleRedo,
    };
    return (
        <GlobalKeyboardShortcuts
            keyMap={globalKeyMap}
            handlerMap={globalKeyHandlers}/>
    );

});


