import React from "react";
import TableCell from "@material-ui/core/TableCell";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import isEqual from "react-fast-compare";
import {DateTimeTableCell} from "../DateTimeTableCell";
import {INotesRepoRow} from "./NotesRepoTable2";
import {MUICheckboxIconButton} from "../../../../web/js/mui/MUICheckboxIconButton";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        colText: {
            width: 'auto',

            overflow: 'hidden',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            textOverflow: 'ellipsis'
        },

        colCreated: {
            whiteSpace: 'nowrap',
            width: '7em'
        },
        colUpdated: {
            whiteSpace: 'nowrap',
            width: '7em'
        },

    }),
);

interface IProps extends INotesRepoRow {
    readonly selected: boolean;
    readonly viewIndex: number;
}

export const NotesRepoTableRowInner = React.memo(function NotesRepoTableRowInner(props: IProps) {

    const classes = useStyles();

    const {viewIndex, selected} = props;

    const contextMenuHandler = React.useCallback((event: React.MouseEvent) => {
    //     selectRow(row.id, event, 'context');
    //     rawContextMenuHandler(event);
    }, []);

    const selectRowClickHandler = React.useCallback((event: React.MouseEvent) => {
        //
        // selectRow(row.id, event, 'click');
        //
        // if (Devices.isTablet() || Devices.isPhone()) {
        //     callbacks.onOpen();
        // }

    }, []);

    return (
        <>

            <TableCell padding="none">
                {/*<AutoBlur>*/}
                    <MUICheckboxIconButton checked={selected}
                                           onChange={selectRowClickHandler}/>
                {/*</AutoBlur>*/}
            </TableCell>

            <TableCell scope="row"
                       className={classes.colText}
                       padding="none"
                       onClick={selectRowClickHandler}
                       onContextMenu={contextMenuHandler}>
                {props.title || 'Untitled'}
            </TableCell>

            <TableCell padding="none"
                       className={classes.colCreated}
                       onClick={selectRowClickHandler}
                       onContextMenu={contextMenuHandler}>

                <DateTimeTableCell datetime={props.created}/>

            </TableCell>

            <TableCell padding="none"
                       className={classes.colUpdated}
                       onClick={selectRowClickHandler}
                       onContextMenu={contextMenuHandler}>

                <DateTimeTableCell datetime={props.updated}/>

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


