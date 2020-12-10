import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import TableRow from "@material-ui/core/TableRow";
import TableCell from '@material-ui/core/TableCell';
import Dialog from '@material-ui/core/Dialog';
import {deepMemo} from '../react/ReactUtils';
import {
    IBaseKeyboardShortcut,
    useKeyboardShortcutsStore,
    useKeyboardShortcutsCallbacks, IKeyboardShortcutWithHandler
} from '../keyboard_shortcuts/KeyboardShortcutsStore';
import {GlobalKeyboardShortcuts} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {KeySequence} from "./KeySequence";
import {PartitionKey} from "polar-shared/src/util/ArrayStreams";
import { useActiveKeyboardShortcutsStore, useActiveKeyboardShortcutsCallbacks } from './ActiveKeyboardShortcutsStore';

interface ActiveKeyBindingProps extends IBaseKeyboardShortcut {


}

interface GroupRowProps {
    readonly group: string;
}

const GroupRow = (props: GroupRowProps) => {

    return (
        <TableRow>

            <TableCell style={{fontSize: '1.2em'}}>
                <b>{props.group}</b>
            </TableCell>
        </TableRow>

    );
}

const ActiveBinding = (props: ActiveKeyBindingProps) => {

    return (
        <TableRow>

            <TableCell style={{fontSize: '1.2em'}}>
                <b>{props.name || 'unnamed'}</b>
            </TableCell>

            <TableCell style={{fontSize: '1.2em'}}>
                {props.description}
            </TableCell>

            <TableCell>
                <div style={{display: 'flex'}}>
                    {props.sequences.map((current, idx) =>
                                       <KeySequence key={idx} sequence={current}/>)}
                </div>
            </TableCell>

        </TableRow>
    );

}

interface GroupBindingsProps {

}

const GroupBindings = (props: GroupBindingsProps) => {

    return (
        <>
            {/*<GroupRow/>*/}
        </>
    )

}

interface KeyboardShortcutGroup {
    readonly group: string;
    readonly groupPriority: number;
}

export const ActiveKeyboardShortcutsTable = () => {

    const {shortcuts} = useKeyboardShortcutsStore(['shortcuts'])
    const {setActive} = useKeyboardShortcutsCallbacks()

    function toPartition(shortcut: IKeyboardShortcutWithHandler): PartitionKey<KeyboardShortcutGroup> {

        const id = shortcut.group || '';

        const group: KeyboardShortcutGroup = {
            group: shortcut.group || '',
            groupPriority: shortcut.groupPriority !== undefined ? shortcut.groupPriority : 0

        }

        return [id, group];

    }

    // const partitions = arrayStream(Object.values(shortcuts))
    //                        .partition(toPartition);

    // const partitionsSorted = Object.entries(partitions)
    //     .sort((a, b) => a[0].)
    //
    // for (const partition of Object.keys(partitions)) {
    //     const value = partitions[partition];
    // }

    const bindings = Object.values(shortcuts)
                           .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    useComponentDidMount(() => setActive(false));
    useComponentWillUnmount(() => setActive(true));

    return (
        <Table size="small">
            <TableBody>
                {bindings.map((binding, idx) =>
                                  <ActiveBinding key={idx} {...binding}/>)}

            </TableBody>

        </Table>
    );

}

const keyMap = {
    SHOW_ALL_HOTKEYS: {
        name: 'Show Keyboard Shortcuts',
        description: "Show the currently active keyboard shortcuts",
        sequences: ["shift+?", '/'],
        priority: -1
    }
};


interface ActiveKeyboardShortcutsDialogProps {
    readonly onClose: () => void;
}

export const ActiveKeyboardShortcutsDialog = deepMemo((props: ActiveKeyboardShortcutsDialogProps) => {

    return (
        <Dialog fullWidth={true}
                transitionDuration={50}
                onKeyDown={() => console.log('press')}
                maxWidth="lg"
                open={true}
                onClose={props.onClose}>
            <DialogTitle>Active Keyboard Shortcuts</DialogTitle>
            <DialogContent>
                <ActiveKeyboardShortcutsTable/>
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


export const ActiveKeyboardShortcuts = deepMemo(() => {

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
