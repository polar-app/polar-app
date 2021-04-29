import {
    IBaseKeyboardShortcut,
    IKeyboardShortcutWithHandler,
} from "../keyboard_shortcuts/KeyboardShortcutsStore";
import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import {KeySequence} from "./KeySequence";
import TableRow from "@material-ui/core/TableRow";
import TableCell from '@material-ui/core/TableCell';
import {ArrayListMultimap} from "polar-shared/src/util/Multimap";
import useTheme from "@material-ui/core/styles/useTheme";

interface IProps {
    readonly shortcuts: {[binding: string]: IKeyboardShortcutWithHandler};
}

export const ActiveKeyboardShortcutsTable = (props: IProps) => {

    const {shortcuts} = props;

    const computeMultimap = React.useCallback(() => {

        const multimap = new ArrayListMultimap<string, IKeyboardShortcutWithHandler>();

        for (const shortcut of Object.values(shortcuts)) {
            multimap.put(shortcut.group || '', shortcut);
        }

        return multimap;

    }, [shortcuts]);

    const multimap = React.useMemo(() => computeMultimap(), [computeMultimap])

    const groups = React.useMemo(() => [...multimap.keys()].sort(), [multimap]);

    return (
        <Table size="small">

            <TableBody>

                {groups.map((group) => (
                    <ActiveBindingGroup key={group} group={group} shortcuts={multimap.get(group)}/>
                ))}

            </TableBody>

        </Table>
    );

}

interface ActiveKeyBindingGroupProps {
    readonly group: string;
    readonly shortcuts: ReadonlyArray<IKeyboardShortcutWithHandler>;

}

const ActiveBindingGroup = (props: ActiveKeyBindingGroupProps) => {

    const bindings = [...props.shortcuts].sort((a, b) => a.name.localeCompare(b.name))

    return (
        <>
            <GroupRow group={props.group}/>

            {bindings.map((binding, idx) =>
                <ActiveBinding key={idx} {...binding}/>)}

        </>
    );

}


interface ActiveKeyBindingProps extends IBaseKeyboardShortcut {}

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


interface GroupRowProps {
    readonly group: string;
}

const GroupRow = (props: GroupRowProps) => {

    const theme = useTheme();

    return (
        <TableRow>

            <TableCell style={{
                           paddingTop: theme.spacing(3),
                           color: theme.palette.text.hint
                        }}
                       colSpan={3}>
                <b>{props.group}</b>
            </TableCell>
        </TableRow>

    );
}
