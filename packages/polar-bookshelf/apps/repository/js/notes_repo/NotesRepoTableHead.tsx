import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import {Sorting} from "../doc_repo/Sorting";
import {MUICheckboxHeaderIconButton} from "../doc_repo/MUICheckboxHeaderIconButton";
import {INotesRepoRow} from "./NotesRepoTable2";

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

export interface NotesRepoColumnDescriptor {
    disablePadding: boolean;
    id: keyof INotesRepoRow;
    label: string;
    numeric: boolean;
    width: string;
    defaultOrder: Sorting.Order;
}

export const COLUMNS: ReadonlyArray<NotesRepoColumnDescriptor> = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Title', width: 'auto', defaultOrder: 'asc' },
    { id: 'created', numeric: false, disablePadding: true, label: 'Created', width: '7em', defaultOrder: 'desc' },
    { id: 'updated', numeric: false, disablePadding: true, label: 'Updated', width: '7em', defaultOrder: 'desc' },
];

export function useNotesRepoColumns() {
    return COLUMNS;
}


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

export const NotesRepoTableHead = React.memo(function NotesRepoTableHead() {

    const classes = useStyles();

    // const {order, orderBy} = useDocRepoStore(['order', 'orderBy']);
    // const {setSort} = useDocRepoCallbacks();

    const order: 'asc' | 'desc' = 'asc';
    const orderBy = 'title';
    const setSort = (newOrder: string, id: string) => {

    };

    const columns = useNotesRepoColumns();

    return (

        <TableHead className={classes.root}>
            <TableRow className={classes.row}>
                <DeviceRouters.NotDesktop>
                    <TableCell style={{width:'50px'}}>
                        <MUICheckboxHeaderIconButton/>
                    </TableCell>
                </DeviceRouters.NotDesktop>

                {/* This is just a placeholder to align the table, it doesn't do much else */}
                <DeviceRouters.Desktop>
                    <Check/>
                </DeviceRouters.Desktop>

                {columns.map((column) => {

                    const newOrder = orderBy === column.id ? Sorting.reverse(order) : column.defaultOrder;

                    return (
                        <TableCell key={column.id}
                                   className={classes.th}
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
                                onClick={() => setSort(newOrder, column.id)}>
                                {column.label}
                                {orderBy === column.id ? (
                                    <span className={classes.visuallyHidden}>
                                            {order === 'asc' ? 'sorted ascending' : 'sorted descending'}
                                        </span>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    )
                })}
                <DeviceRouters.NotDesktop>
                    <SelectionButtonsWithinTableCell/>
                </DeviceRouters.NotDesktop>

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
