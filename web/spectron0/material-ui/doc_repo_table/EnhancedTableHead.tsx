import React from "react";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {Order} from "./Sorting";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {COLUMNS} from "./Columns";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
            whiteSpace: 'nowrap'
        }
    }),
);

interface IProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof RepoDocInfo) => void;
    onSelectAllClick: (selectAll: boolean) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

export function EnhancedTableHead(props: IProps) {
    const classes = useStyles();

    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof RepoDocInfo) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {/*<Checkbox*/}
                    {/*    indeterminate={numSelected > 0 && numSelected < rowCount}*/}
                    {/*    checked={rowCount > 0 && numSelected === rowCount}*/}
                    {/*    onChange={onSelectAllClick}*/}
                    {/*    inputProps={{ 'aria-label': 'select all desserts' }}*/}
                    {/*/>*/}
                </TableCell>
                {COLUMNS.map((column) => (
                    <TableCell key={column.id}
                              // align={headCell.numeric ? 'right' : 'left'}
                               className={classes.th}
                               padding={column.disablePadding ? 'none' : 'default'}
                               sortDirection={orderBy === column.id ? order : false}>

                        <TableSortLabel
                            active={orderBy === column.id}
                            direction={orderBy === column.id ? order : 'asc'}
                            onClick={createSortHandler(column.id)}>
                            {column.label}
                            {orderBy === column.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell />

            </TableRow>
        </TableHead>
    );
}
