import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {COLUMN_MAP, DOC_BUTTON_COLUMN_WIDTH} from "./Columns";
import {Sorting} from "./Sorting";
import {
    useDocRepoStore, useDocRepoCallbacks
} from "./DocRepoStore2";
import {useDocRepoColumnsPrefs} from "./DocRepoColumnsPrefsHook";
import {DocColumnsSelectorWithPrefs} from "./DocColumnsSelectorWithPrefs";
import {isPresent} from "polar-shared/src/Preconditions";

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
        },
        row: {
            "& th": {
                paddingTop: '3px',
                paddingBottom: '3px',
                paddingLeft: 0,
                paddingRight: 0,
                backgroundColor: `${theme.palette.background.default} !important`
            }
        }
    }),
);

const Check = React.memo(() => {
    return (
        <TableCell key="left-checkbox"
                   padding="checkbox">
        </TableCell>
    )
});

const ColumnSelector = React.memo(() => {
    return (

        <TableCell key="right-filter"
                   style={{
                       width: DOC_BUTTON_COLUMN_WIDTH,
                   }}>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <DocColumnsSelectorWithPrefs/>
            </div>
        </TableCell>

    );

});

export const DocRepoTableHead = React.memo(() => {

    const classes = useStyles();

    const {order, orderBy} = useDocRepoStore(['order', 'orderBy']);
    const {setSort} = useDocRepoCallbacks();

    const selectedColumns = useDocRepoColumnsPrefs();

    const columns = selectedColumns.map(current => COLUMN_MAP[current])
                                   .filter(current => isPresent(current));

    return (

            <TableHead className={classes.root}>
                <TableRow className={classes.row}>

                    <Check/>

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
                                    onClick={() => setSort(newOrder, column.id)}>
                                    {column.label}
                                    {orderBy === column.id ? (
                                        <span className={classes.visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        )
                    })}

                    <ColumnSelector/>

                </TableRow>
            </TableHead>
    );
});
