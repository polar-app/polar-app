import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {observer} from "mobx-react-lite";
import {BaseR} from "./TableGridStore";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        cell: {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            textOverflow: 'ellipsis'
        },

    }),
);

interface IProps {
    readonly selected: boolean;
    readonly viewIndex: number;
}

export const NotesRepoTableCells = observer(function NotesRepoTableCells<R extends BaseR>(props: IProps & R) {
    //
    // const classes = useStyles();
    // const tableGridStore = useTableGridStore();
    //
    // const {selected} = props;
    //
    // const contextMenuHandler = React.useCallback((event: React.MouseEvent) => {
    // //     selectRow(row.id, event, 'context');
    // //     rawContextMenuHandler(event);
    // }, []);
    //
    // const selectRowClickHandler = React.useCallback((event: React.MouseEvent) => {
    //
    //     tableGridStore.selectRow(props.id, event, 'click');
    //
    //     if (Devices.isTablet() || Devices.isPhone()) {
    //         tableGridStore.onOpen(props.id);
    //     }
    //
    // }, [tableGridStore, props.id]);
    //
    // return (
    //     <>
    //
    //         <TableCell padding="none"
    //                    onClick={event => event.stopPropagation()}
    //                    onDoubleClick={event => event.stopPropagation()}>
    //             {/*<AutoBlur>*/}
    //                 <MUICheckboxIconButton checked={selected}
    //                                        onChange={(event) => tableGridStore.selectRow(props.id, event, 'checkbox')}/>
    //             {/*</AutoBlur>*/}
    //         </TableCell>
    //
    //         {tableGridStore.columnDescriptors.map(columnDescriptor => (
    //
    //             <React.Fragment key={columnDescriptor.id}>
    //
    //                 <DeviceRouters.Any devices={columnDescriptor.devices}>
    //
    //                     <TableCell className={classes.cell}
    //                                padding={columnDescriptor.disablePadding ? 'none' : undefined}
    //                                style={{width: columnDescriptor.width}}
    //                                onClick={selectRowClickHandler}
    //                                onContextMenu={contextMenuHandler}>
    //
    //                         {columnDescriptor.type === 'text' && (
    //                             props[columnDescriptor.id] || columnDescriptor.defaultLabel || ""
    //                         )}
    //
    //                         {columnDescriptor.type === 'date' && (
    //                             <DateTimeTableCell datetime={props[columnDescriptor.id]}/>
    //                         )}
    //
    //                         {columnDescriptor.type === 'number' && (
    //                             <>
    //                                 {props[columnDescriptor.id]}
    //                             </>
    //                         )}
    //
    //                     </TableCell>
    //
    //                 </DeviceRouters.Any>
    //
    //             </React.Fragment>
    //
    //         ))}
    //
    //         <TableCell align="right"
    //                    padding="none"
    //                    onClick={event => event.stopPropagation()}
    //                    onDoubleClick={event => event.stopPropagation()}>
    //             <TableGridOverflowMenuButton id={props.id}/>
    //         </TableCell>
    //
    //     </>
    // );

    return null;
});
