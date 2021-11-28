import React from "react";
import TableRow from "@material-ui/core/TableRow";
import {NotesRepoTableRowInner} from "./NotesRepoTableRowInner";
import {BaseR} from "./TableGridStore";

interface IProps extends BaseR {
    readonly viewIndex: number;
    readonly selected: boolean;
    readonly onContextMenu: (event: React.MouseEvent) => void;
    readonly onOpen: (id: string) => void;
}

export const NotesRepoTableRow = React.memo(function NotesRepoTableRow(props: IProps) {

    return (
        <TableRow
            hover
            role="checkbox"
            aria-checked={props.selected}
            draggable
            onContextMenu={event => props.onContextMenu(event)}
            onDoubleClick={() => props.onOpen(props.id)}
            selected={props.selected}>

            <NotesRepoTableRowInner {...props}/>

        </TableRow>
    );
});

