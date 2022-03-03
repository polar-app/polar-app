import React from "react";
import TableRow from "@material-ui/core/TableRow";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {NotesRepoTableRowInner} from "./NotesRepoTableRowInner";
import {INotesRepoRow, useNotesRepoContextMenu, useTableGridStore} from "./NotesRepoTable2";
import {observer} from "mobx-react-lite";
import {IMouseEvent} from "../doc_repo/MUIContextMenu";

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

    const tableGridStore = useTableGridStore();

    const contextMenuHandlers = useNotesRepoContextMenu();

    const onContextMenu = React.useCallback((event: IMouseEvent) => {
        if (tableGridStore.selected.length > 0) {
            contextMenuHandlers.onContextMenu(event);
        }
    }, [contextMenuHandlers, tableGridStore]);

    // {...contextMenuHandlers}
    // onDragStart={callbacks.onDragStart}
    // onDragEnd={callbacks.onDragEnd}
    // onDoubleClick={callbacks.onOpen}

    return (
        <TableRow
            onContextMenu={onContextMenu}
            hover
            className={classes.tr}
            role="checkbox"
            aria-checked={selected}
            draggable
            onDoubleClick={() => tableGridStore.onOpen(props.id)}
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

