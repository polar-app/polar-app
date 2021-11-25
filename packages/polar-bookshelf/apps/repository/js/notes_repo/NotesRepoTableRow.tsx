import React from "react";
import TableRow from "@material-ui/core/TableRow";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {NotesRepoTableRowInner} from "./NotesRepoTableRowInner";
import {INotesRepoRow} from "./NotesRepoTable2";
import {observer} from "mobx-react-lite";
import {useNotesRepoStore} from "./NotesRepoStore";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
        },
        paper: {
            width: '100%',
            height: '100%',
        },
        table: {
            minWidth: 0,
            maxWidth: '100%',
            tableLayout: 'fixed'
        },
        tr: {
            // borderSpacing: '100px'
        },
        td: {
            whiteSpace: 'nowrap'
        },

    }),
);

interface IProps extends INotesRepoRow {
    readonly viewIndex: number;
    readonly selected: boolean;
}

const Delegate = observer(function Delegate(props: IProps) {

    const classes = useStyles();
    const {selected} = props;

    const notesRepoStore = useNotesRepoStore();

    // {...contextMenuHandlers}
    // onDragStart={callbacks.onDragStart}
    // onDragEnd={callbacks.onDragEnd}
    // onDoubleClick={callbacks.onOpen}

    return (
        <TableRow
            hover
            className={classes.tr}
            role="checkbox"
            aria-checked={selected}
            draggable
            onDoubleClick={() => notesRepoStore.onOpen(props.id)}
            selected={selected}>

            <NotesRepoTableRowInner {...props}/>

        </TableRow>
    );

});

export const NotesRepoTableRow = React.memo(function NotesRepoTableRow(props: IProps) {
    return (
        <Delegate {...props}/>
    );
});

