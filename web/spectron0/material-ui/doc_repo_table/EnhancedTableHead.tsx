import React from "react";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {COLUMNS, DOC_BUTTON_COLUMN_WIDTH} from "./Columns";
import {Sorting} from "./Sorting";
import Order = Sorting.Order;

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
    readonly onRequestSort: (event: React.MouseEvent<unknown>,
                             property: keyof RepoDocInfo,
                             order: Sorting.Order) => void;
    readonly order: Order;
    readonly orderBy: string;
}

export function EnhancedTableHead(props: IProps) {
    const classes = useStyles();

    const { order, orderBy, onRequestSort } = props;

    const createSortHandler = (order: Sorting.Order,
                               orderBy: keyof RepoDocInfo) => (event: React.MouseEvent<unknown>) => {

        onRequestSort(event, orderBy, order);

    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                </TableCell>
                {COLUMNS.map((column) => {

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
                                onClick={createSortHandler(newOrder, column.id)}>
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

                <TableCell style={{width: DOC_BUTTON_COLUMN_WIDTH}}/>

            </TableRow>
        </TableHead>
    );
}
