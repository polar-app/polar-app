import * as React from "react";
import {IKeyboardShortcutWithHandler, useKeyboardShortcutsStore} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import {useActiveKeyboardShortcutsCallbacks, useActiveKeyboardShortcutsStore} from "./ActiveKeyboardShortcutsStore";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import { ActionListItem } from "./ActionListItem";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            fontSize: '1.8em'
        },
    }),
);

interface ActiveKeyboardShortcutsTableProps {
    readonly onExecute: (event: React.MouseEvent | React.KeyboardEvent, shortcut: IKeyboardShortcutWithHandler) => void;
}

export const ActiveKeyboardShortcutsTable2 = React.memo((props: ActiveKeyboardShortcutsTableProps) => {

    const {index, filter} = useActiveKeyboardShortcutsStore(['index', 'filter']);
    const {setFilter, setIndex} = useActiveKeyboardShortcutsCallbacks();
    const {shortcuts} = useKeyboardShortcutsStore(['shortcuts'])
    const classes = useStyles();

    const filtered = Object.values(shortcuts)
        .filter(shortcut => filter === undefined || shortcut.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        if (event.shiftKey || event.ctrlKey || event.metaKey) {
            // we only work with the raw keys.
            return;
        }

        function stopEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        function computeNewIndex(delta: number) {

            if (index === undefined) {

                if (delta === 1) {
                    // go to the start
                    return 0;
                }

                if (index === -1) {
                    // got to the end
                    return filtered.length - 1;
                }

                return 0;

            }

            const newIndex = index + delta;

            if (newIndex < 0) {
                return filtered.length - 1;
            }

            if (newIndex >= filtered.length) {
                return 0;
            }

            return newIndex;

        }

        function handleNewIndex(delta: number) {
            const newIndex = computeNewIndex(delta);
            setIndex(newIndex);
        }

        if (event.key === 'ArrowDown') {
            stopEvent();
            handleNewIndex(1);
        }

        if (event.key === 'ArrowUp') {
            stopEvent();
            handleNewIndex(-1);
        }

        if (event.key === 'Enter') {

            if (index !== undefined) {
                const shortcut = filtered[index];
                props.onExecute(event, shortcut);
            }
        }

    }, [filtered, index, props, setIndex]);

    return (

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '800px',
            maxHeight: '200px',
        }}>

            <TextField autoFocus={true}
                       onKeyDown={handleKeyDown}
                       onChange={event => setFilter(event.target.value) }/>

            <List component="nav"
                  style={{
                      overflow: 'auto'
                  }}>

                {filtered.map((shortcut, idx) => {

                    const selected = index === idx;
                    const key = (shortcut.group || '') + ':' + shortcut.name + ':' + selected;

                    return (
                        <ActionListItem key={key}
                                        text={shortcut.name}
                                        icon={shortcut.icon}
                                        selected={selected}
                                        sequences={shortcut.sequences}
                                        onClick={event => props.onExecute(event, shortcut)}/>
                    );
                })}

            </List>
        </div>

    )
});



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

interface GroupBindingsProps {

}

const GroupBindings = (props: GroupBindingsProps) => {

    return (
        <>
            {/*<GroupRow/>*/}
        </>
    )

}
