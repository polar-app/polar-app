import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import {Sorting} from "../doc_repo/Sorting";
import {useTableGridStore} from "./NotesRepoTable2";
import {observer} from "mobx-react-lite";
import {NotesRepoTableHeadCheck} from "./NotesRepoTableHeadCheck";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        th: {
            whiteSpace: 'nowrap',
            width: '84px'
        },
        row: {
            "& th": {
                paddingTop: theme.spacing(1),
                paddingBottom: theme.spacing(1),
                paddingLeft: 0,
                paddingRight: 0,
                borderCollapse: 'collapse',
                lineHeight: '1em'
            }
        },
        selectionIconsContainer:{
            display: 'flex',
            flexDirection:'row-reverse',
            paddingRight: '15px',
            marginLeft: 'auto'
        },
        reverseRow:{
            display: 'flex',
            flexDirection: 'row-reverse'
        }
    }),
);

const Check = React.memo(function Check() {
    return (
        <TableCell key="left-checkbox"
                   padding="checkbox">
        </TableCell>
    )
});

const SelectionOrToggleButtons = React.memo(function SelectionOrToggleButtons() {
    const classes = useStyles();
    // const {filters, selected} = useDocRepoStore(['filters', 'selected']);
    // const callbacks = useDocRepoCallbacks();

    const selected = [];

    // const {setFilters} = callbacks;
    //
    // return(<>
    //     {selected.length > 0 ?
    //         <SelectionActiveButtons className={classes.reverseRow}/>
    //         :
    //         <div className={classes.selectionIconsContainer}>
    //             <MUIToggleButton id="toggle-archived"
    //                              iconOnly
    //                              tooltip="Toggle archived docs"
    //                              size={'small'}
    //                              icon={<ArchiveIcon/>}
    //                              initialValue={filters.archived}
    //                              onChange={(value: any) => setFilters({...filters, archived: value})}/>
    //             <MUIToggleButton id="toggle-flagged"
    //                              iconOnly
    //                              tooltip="Show only flagged docs"
    //                              size={'small'}
    //                              icon={<FlagIcon/>}
    //                              initialValue={filters.flagged}
    //                              onChange={(value: any) => setFilters({...filters, flagged: value})}/>
    //         </div>
    //     }
    // </>);

    return null;
});


export const NotesRepoTableHead = observer(function NotesRepoTableHead() {

    const classes = useStyles();

    const tableGridStore = useTableGridStore();

    const {order, orderBy} = tableGridStore;

    return (

        <TableHead className={classes.root}>
            <TableRow className={classes.row}>
                <DeviceRouters.NotDesktop>
                    <TableCell style={{width:'50px'}}>
                        <NotesRepoTableHeadCheck/>
                    </TableCell>
                </DeviceRouters.NotDesktop>

                {/* This is just a placeholder to align the table, it doesn't do much else */}
                <DeviceRouters.Desktop>
                    <Check/>
                </DeviceRouters.Desktop>

                {tableGridStore.columnDescriptors.map((column) => {

                    const newOrder = orderBy === column.id ? Sorting.reverse(order) : column.defaultOrder;

                    return (
                        <React.Fragment key={column.id}>
                            <DeviceRouters.Any devices={column.devices}>

                                <TableCell className={classes.th}
                                           style={{
                                               width: column.width,
                                               minWidth: column.width
                                           }}
                                           padding={column.disablePadding ? 'none' : 'default'}
                                           sortDirection={orderBy === column.id ? order : false}>

                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={order}
                                        hideSortIcon
                                        onClick={() => tableGridStore.setOrderBy(column.id, newOrder)}>
                                        {column.label}
                                        {orderBy === column.id ? (
                                            <span className={classes.visuallyHidden}>
                                                    {order === 'asc' ? 'sorted ascending' : 'sorted descending'}
                                                </span>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            </DeviceRouters.Any>
                        </React.Fragment>
                    )
                })}

                <TableCell style={{width:'30px'}} padding="none">
                    {/*<Check/>*/}
                </TableCell>

            </TableRow>
        </TableHead>
    );
});

const SelectionButtonsWithinTableCell = React.memo(function SelectionButtonsWithinTableCell() {
    const classes = useStyles();

    return(
        <TableCell className={classes.th} style={{ display: 'table-cell'}}>
            <SelectionOrToggleButtons/>
        </TableCell>
    );
});
