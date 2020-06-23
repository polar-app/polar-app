import React from 'react';
import {
    ApplicationKeyMap,
    getApplicationKeyMap,
    GlobalHotKeys,
    KeyMapOptions
} from "react-hotkeys"
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import TableRow from "@material-ui/core/TableRow";
import TableCell from '@material-ui/core/TableCell';
import grey from "@material-ui/core/colors/grey";

interface KeySequenceProps {
    readonly sequence: string;
}

const KeySequence = (props: KeySequenceProps) => {

    return (
        <div style={{
                padding: '5px',
                borderRadius: '2px',
                border: `1px solid ${grey[500]}`,
                backgroundColor: grey[200],
                color: grey[900],
                margin: '5px'
             }}>
            {props.sequence}
        </div>
    )

}

interface ActiveKeyBindingProps {

    readonly sequences: ReadonlyArray<KeyMapOptions>;
    readonly name?: string;
    readonly group?: string;
    readonly description?: string;

}

const ActiveBinding = (props: ActiveKeyBindingProps) => {

    function toSequences(sequence: string | ReadonlyArray<string>): ReadonlyArray<string> {

        if (typeof sequence === 'string') {
            return [sequence];
        }

        return sequence;

    }

    const sequences: ReadonlyArray<string> =
        arrayStream(props.sequences)
            .map(current => current.sequence)
            .map(toSequences)
            .flatMap(current => current)
            .collect()

    return (
        <TableRow>

            <TableCell>
                <b>{props.name || 'unnamed'}</b>
            </TableCell>

            <TableCell>
                {props.description}
            </TableCell>

            <TableCell>
                <div style={{display: 'flex'}}>
                    {sequences.map((current, idx) =>
                                       <KeySequence key={idx} sequence={current}/>)}
                </div>
            </TableCell>

        </TableRow>
    );

}

export const ActiveHotKeys = () => {

    const keyMap: ApplicationKeyMap = getApplicationKeyMap();

    const bindings = Object.values(keyMap);

    return (
        <Table size="small">
            <TableBody>
                {bindings.map((binding, idx) =>
                                  <ActiveBinding key={idx} {...binding}/>)}

            </TableBody>

        </Table>
    );

}

const keyMap = { SHOW_ALL_HOTKEYS: "shift+?" };

export const ActiveHotKeyBindings = () => {

    const [open, setOpen] = React.useState(false);

    function handleClose() {
        setOpen(false);
    }

    const handlers = { SHOW_ALL_HOTKEYS: () => setOpen(true) };

    return (
        <GlobalHotKeys keyMap={keyMap} handlers={handlers}>

            <Dialog fullWidth={true}
                    maxWidth="md"
                    open={open}
                    onClose={handleClose}>
                <DialogTitle>Active Key Bindings</DialogTitle>
                <DialogContent>
                    <ActiveHotKeys/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}
                            color="primary"
                            variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </GlobalHotKeys>
    )

}
