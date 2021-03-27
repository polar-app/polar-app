import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import {deepMemo} from '../react/ReactUtils';
import {GlobalKeyboardShortcuts} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import { useActiveKeyboardShortcutsStore, useActiveKeyboardShortcutsCallbacks } from './ActiveKeyboardShortcutsStore';
import { ActiveKeyboardShortcutsTable } from './ActiveKeyboardShortcutsTable';
import {useKeyboardShortcutsCallbacks, useKeyboardShortcutsStore} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";



const keyMap = {
    SHOW_ALL_HOTKEYS: {
        group: 'Help',
        name: 'Show Keyboard Shortcuts',
        description: "Show the currently active keyboard shortcuts",
        sequences: ["shift+?", '/'],
        priority: -1
    }
};


interface ActiveKeyboardShortcutsDialogProps {
    readonly onClose: () => void;
}

export const ActiveKeyboardShortcutsDialog = deepMemo(function ActiveKeyboardShortcutsDialog(props: ActiveKeyboardShortcutsDialogProps) {

    const {shortcuts} = useKeyboardShortcutsStore(['shortcuts'])
    const {setActive} = useKeyboardShortcutsCallbacks()

    useComponentDidMount(() => setActive(false));
    useComponentWillUnmount(() => setActive(true));

    return (
        <Dialog fullWidth={true}
                transitionDuration={50}
                maxWidth="lg"
                open={true}
                onClose={props.onClose}>
            <DialogTitle>Active Keyboard Shortcuts</DialogTitle>
            <DialogContent>
                <ActiveKeyboardShortcutsTable shortcuts={shortcuts}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}
                        size="large"
                        color="primary"
                        variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );

});


export const ActiveKeyboardShortcuts = deepMemo(function ActiveKeyboardShortcuts() {

    const {showActiveShortcuts} = useActiveKeyboardShortcutsStore(['showActiveShortcuts']);
    const {setShowActiveShortcuts} = useActiveKeyboardShortcutsCallbacks();

    function handleClose() {
        setShowActiveShortcuts(false);
    }

    const handlers = {
        SHOW_ALL_HOTKEYS: () => setShowActiveShortcuts(true)
    };

    return (
        <>
            <GlobalKeyboardShortcuts keyMap={keyMap}
                                     handlerMap={handlers}/>

            {showActiveShortcuts && <ActiveKeyboardShortcutsDialog onClose={handleClose}/>}

        </>
    );

});
