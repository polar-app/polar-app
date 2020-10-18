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
import {arrayStream, PartitionKey} from "polar-shared/src/util/ArrayStreams";

interface ActiveKeyBindingProps extends IBaseKeyboardShortcut {


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

    const partitions = arrayStream(Object.values(shortcuts))
                        .partition(toPartition);

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

export const ActiveKeyboardShortcuts = deepMemo(() => {

    const [open, setOpen] = React.useState(false);

    function handleClose() {
        setOpen(false);
    }

    const handlers = {
        SHOW_ALL_HOTKEYS: () => {
            setOpen(true)
        }
    };

    return (
        <>
            <GlobalKeyboardShortcuts keyMap={keyMap}
                                     handlerMap={handlers}/>

            <Dialog fullWidth={true}
                    maxWidth="lg"
                    open={open}
                    onClose={handleClose}>
                <DialogTitle>Active Keyboard Shortcuts</DialogTitle>
                <DialogContent>
                    <ActiveKeyboardShortcutsTable/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}
                            size="large"
                            color="primary"
                            variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );

});
