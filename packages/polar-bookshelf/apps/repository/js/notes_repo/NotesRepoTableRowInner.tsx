import React from "react";
import TableCell from "@material-ui/core/TableCell";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {DateTimeTableCell} from "../DateTimeTableCell";
import {INotesRepoRow, useNotesRepoContextMenu, useTableGridStore} from "./NotesRepoTable2";
import {MUICheckboxIconButton} from "../../../../web/js/mui/MUICheckboxIconButton";
import {observer} from "mobx-react-lite";
import {Devices} from "polar-shared/src/util/Devices";
import {StandardIconButton} from "../doc_repo/buttons/StandardIconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        cell: {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            textOverflow: 'ellipsis'
        },

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

export const NotesRepoTableRowInner = observer(function NotesRepoTableRowInner(props: IProps) {

    const classes = useStyles();
    const tableGridStore = useTableGridStore();

    const {selected} = props;

    const contextMenuHandler = React.useCallback((event: React.MouseEvent) => {
    //     selectRow(row.id, event, 'context');
    //     rawContextMenuHandler(event);
    }, []);

    const selectRowClickHandler = React.useCallback((event: React.MouseEvent) => {

        tableGridStore.selectRow(props.id, event, 'click');

        if (Devices.isTablet() || Devices.isPhone()) {
            tableGridStore.onOpen(props.id);
        }

    }, [tableGridStore, props.id]);

    return (
        <>

            <TableCell padding="none"
                       onClick={event => event.stopPropagation()}
                       onDoubleClick={event => event.stopPropagation()}>
                {/*<AutoBlur>*/}
                    <MUICheckboxIconButton checked={selected}
                                           onChange={(event) => tableGridStore.selectRow(props.id, event, 'checkbox')}/>
                {/*</AutoBlur>*/}
            </TableCell>

            {tableGridStore.columnDescriptors.map(columnDescriptor => (

                <React.Fragment key={columnDescriptor.id}>

                    <DeviceRouters.Any devices={columnDescriptor.devices}>

                        <TableCell className={classes.cell}
                                   padding={columnDescriptor.disablePadding ? 'none' : undefined}
                                   style={{width: columnDescriptor.width}}
                                   onClick={selectRowClickHandler}
                                   onContextMenu={contextMenuHandler}>

                            {columnDescriptor.type === 'text' && (
                                props[columnDescriptor.id] || columnDescriptor.defaultLabel || ""
                            )}

                            {columnDescriptor.type === 'date' && (
                                <DateTimeTableCell datetime={props[columnDescriptor.id]}/>
                            )}

                            {columnDescriptor.type === 'number' && (
                                <>
                                    {props[columnDescriptor.id]}
                                </>
                            )}

                        </TableCell>

                    </DeviceRouters.Any>

                </React.Fragment>

            ))}

            {/*<TableCell scope="row"*/}
            {/*           className={classes.colText}*/}
            {/*           padding="none"*/}
            {/*           onClick={selectRowClickHandler}*/}
            {/*           onContextMenu={contextMenuHandler}>*/}
            {/*    {props.title || 'Untitled'}*/}
            {/*</TableCell>*/}

            {/*<TableCell padding="none"*/}
            {/*           className={classes.colCreated}*/}
            {/*           onClick={selectRowClickHandler}*/}
            {/*           onContextMenu={contextMenuHandler}>*/}

            {/*    <DateTimeTableCell datetime={props.created}/>*/}

            {/*</TableCell>*/}

            {/*<TableCell padding="none"*/}
            {/*           className={classes.colUpdated}*/}
            {/*           onClick={selectRowClickHandler}*/}
            {/*           onContextMenu={contextMenuHandler}>*/}

            {/*    <DateTimeTableCell datetime={props.updated}/>*/}

            {/*</TableCell>*/}

            <TableCell align="right"
                       padding="none"
                       onClick={event => event.stopPropagation()}
                       onDoubleClick={event => event.stopPropagation()}>
                <TableGridOverflowMenuButton id={props.id}/>
            </TableCell>

        </>
    );

});

interface ITableGridOverflowMenuButtonProps {
    readonly id: string;
}

export const TableGridOverflowMenuButton = observer(function TableGridOverflowMenuButton(props: ITableGridOverflowMenuButtonProps) {

    const tableGridStore = useTableGridStore();

    const contextMenuHandlers = useNotesRepoContextMenu();

    const handleDropdownMenu = React.useCallback((event: React.MouseEvent) => {
        tableGridStore.selectRow(props.id, event, 'click');
        contextMenuHandlers.onContextMenu(event)
    }, []);

    return (
        <StandardIconButton tooltip="More"
                            // aria-controls="doc-dropdown-menu"
                            aria-haspopup="true"
                            onClick={handleDropdownMenu}
                            size="small">
            <MoreVertIcon/>
        </StandardIconButton>
    );

});

