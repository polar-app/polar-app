import React from "react";
import TableCell from "@material-ui/core/TableCell";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import isEqual from "react-fast-compare";
import {DateTimeTableCell} from "../DateTimeTableCell";
import {IBlockRepoRow} from "./NotesRepoTable2";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }),
);

interface IProps extends IBlockRepoRow {
    readonly viewIndex: number;
}

export const NotesRepoTableRowInner = React.memo(function NotesRepoTableRowInner(props: IProps) {

    const classes = useStyles();

    const {viewIndex} = props;

    const contextMenuHandler = React.useCallback((event: React.MouseEvent) => {
    //     selectRow(row.id, event, 'context');
    //     rawContextMenuHandler(event);
    }, []);

    const selectRowClickHandler = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        //
        // selectRow(row.id, event, 'click');
        //
        // if (Devices.isTablet() || Devices.isPhone()) {
        //     callbacks.onOpen();
        // }

    }, []);

    return (
        <>

            <TableCell scope="row"
                       padding="none"
                       onClick={selectRowClickHandler}
                       onContextMenu={contextMenuHandler}>
                {props.text || 'Untitled'}
            </TableCell>

            <TableCell padding="none"
                       onClick={selectRowClickHandler}
                       onContextMenu={contextMenuHandler}>

                <DateTimeTableCell datetime={props.created}/>

            </TableCell>

            {/*<TableCell align="right"*/}
            {/*           padding="none"*/}
            {/*           onClick={event => event.stopPropagation()}*/}
            {/*           onDoubleClick={event => event.stopPropagation()}>*/}
            {/*    {props.text}*/}
            {/*</TableCell>*/}
        </>
    );

}, isEqual);
