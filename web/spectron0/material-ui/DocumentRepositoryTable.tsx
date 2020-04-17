import React from 'react';
import clsx from 'clsx';
import {
    createStyles,
    lighten,
    makeStyles,
    Theme
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Grid from "@material-ui/core/Grid";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import {
    ISODateTimeString,
    ISODateTimeStrings
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TimeDurations} from "polar-shared/src/util/TimeDurations";
import {DateTimeTableCell} from "../../../apps/repository/js/DateTimeTableCell";
import Box from "@material-ui/core/Box";
import {DocButtons} from "./DocButtonsDemo";
import {RepoDocInfo} from "../../../apps/repository/js/RepoDocInfo";
import {arrayStream, ArrayStreams} from "polar-shared/src/util/ArrayStreams";
import {Preconditions} from "polar-shared/src/Preconditions";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {

    // const toVal = (value: number | string | ReadonlyArray<string>): number | string => {
    //
    //     if (typeof value ==='array') {
    //         return value.join(', ');
    //     }
    //
    //     return value;
    //
    // };
    //
    // const aVal = toVal(a[orderBy]);
    // const bVal = toVal(b[orderBy]);

    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator(order: Order,
                       orderBy: string): (a: { [key: string]: any},
                                          b: { [key: string]: any}) => number {

    // FIXME: make sure I can sort by tag

    // TODO: this is kind of ugly in that it specifices a NEGATIVE value andit's
    // not completely clear.

    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);

}

function stableSort<T>(array: ReadonlyArray<T>, comparator: (a: T, b: T) => number): ReadonlyArray<T> {

    return arrayStream(array)
        .sort(comparator)
        .collect();

    //
    //
    // const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    // stabilizedThis.sort((a, b) => {
    //     const order = comparator(a[0], b[0]);
    //     if (order !== 0) return order;
    //     return a[1] - b[1];
    // });
    // return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof RepoDocInfo;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
    { id: 'added', numeric: false, disablePadding: false, label: 'Added' },
    { id: 'lastUpdated', numeric: false, disablePadding: false, label: 'Last Updated' },
    { id: 'tags', numeric: true, disablePadding: false, label: 'Tags' },
    { id: 'progress', numeric: true, disablePadding: true, label: 'Progress' },
];

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof RepoDocInfo) => void;
    onSelectAllClick: (selectAll: boolean) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        // align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell padding="none"/>
            </TableRow>
        </TableHead>
    );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // paddingLeft: theme.spacing(2),
            // paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
    }),
);

const EnhancedTableToolbar2 = (props: EnhancedTableToolbarProps) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Nutrition
                </Typography>
            )}
            {numSelected > 0 ? (
                <div style={{display: 'flex'}}>
                    <Tooltip title="Tag">
                        <IconButton>
                            <LocalOfferIcon color="primary"/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                        <IconButton aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

interface EnhancedTableToolbarProps {
    readonly data: ReadonlyArray<RepoDocInfo>;
    readonly numSelected: number;
    readonly page: number;
    readonly rowsPerPage: number;
    readonly onChangePage: (page: number) => void;
    readonly onChangeRowsPerPage: (rowsPerPAge: number) => void;
    readonly onSelectAllRows: (selected: boolean) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const classes = useToolbarStyles();
    const { numSelected, rowsPerPage, page, data } = props;

    const handleChangePage = (event: unknown, newPage: number) => {
        props.onChangePage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        props.onChangeRowsPerPage(rowsPerPage);

    };

    return (
        <Grid container
              direction="row"
              justify="space-between"
              alignItems="center">

            <Grid item>

                <Box pl={1}>

                    <Grid container
                          direction="row"
                          justify="flex-start"
                          alignItems="center">

                        <Grid item>
                            <Checkbox
                                // indeterminate={numSelected > 0 && numSelected < rowCount}
                                // checked={rowCount > 0 && numSelected === rowCount}
                                // onChange={onSelectAllClick}
                                onChange={event => props.onSelectAllRows(event.target.checked)}
                                inputProps={{ 'aria-label': 'select all documents' }}
                            />
                        </Grid>

                        {numSelected > 0 && (
                            <Grid item>
                                <Grid container
                                      spacing={1}
                                      direction="row"
                                      justify="flex-start"
                                      alignItems="center">

                                    <Grid item>
                                        <Tooltip title="Tag">
                                            <IconButton>
                                                <LocalOfferIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>

                                    <Divider orientation="vertical" flexItem/>

                                    <Grid item>
                                        <Tooltip title="Delete">
                                            <IconButton aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>

                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Box>

            </Grid>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                style={{
                    padding: 0,
                    minHeight: 0
                }}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />

        </Grid>

        // <Toolbar
        //     className={clsx(classes.root, {
        //         [classes.highlight]: numSelected > 0,
        //     })}
        // >
        //     {numSelected > 0 ? (
        //         <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
        //             {numSelected} selected
        //         </Typography>
        //     ) : (
        //         <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        //             Nutrition
        //         </Typography>
        //     )}
        //     {numSelected > 0 && (
        //         <div style={{display: 'flex'}}>
        //             <Tooltip title="Tag">
        //                 <IconButton>
        //                     <LocalOfferIcon color="primary"/>
        //                 </IconButton>
        //             </Tooltip>
        //
        //             <Tooltip title="Delete">
        //                 <IconButton aria-label="delete">
        //                     <DeleteIcon />
        //                 </IconButton>
        //             </Tooltip>
        //         </div>
        //     )}
        // </Toolbar>
    );
};


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
        },
        paper: {
            width: '100%',
            height: '100%',
            // marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
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
    }),
);

interface IProps {
    readonly data: ReadonlyArray<RepoDocInfo>;
}

export default function DocumentRepositoryTable(props: IProps) {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<keyof RepoDocInfo>('progress');
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    let {data} = props;

    Preconditions.assertPresent(data, 'data');

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof RepoDocInfo) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllRows = (selected: boolean) => {
        if (selected) {
            // TODO: migrate to using an ID not a title.
            const newSelected = data.map((n) => n.title);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (rowsPerPage: number) => {
        setRowsPerPage(rowsPerPage);
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    // TODO: refactor this to be more functional
    data = stableSort(data, getComparator(order, orderBy));

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} style={{display: 'flex', flexDirection: 'column'}}>
                <EnhancedTableToolbar data={data}
                                      numSelected={selected.length}
                                      rowsPerPage={rowsPerPage}
                                      onChangePage={handleChangePage}
                                      onChangeRowsPerPage={handleChangeRowsPerPage}
                                      onSelectAllRows={handleSelectAllRows}
                                      page={page}/>
                <TableContainer style={{flexGrow: 1}}>
                    <Table
                        stickyHeader
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'small'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllRows}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {stableSort(data, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.title);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.title)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.title}
                                            selected={isItemSelected}>

                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {row.title}
                                            </TableCell>
                                            <TableCell >
                                                <DateTimeTableCell datetime={row.added}/>
                                            </TableCell>
                                            <TableCell >
                                                <DateTimeTableCell datetime={row.lastUpdated}/>
                                            </TableCell>
                                            <TableCell>
                                                {/*{row.tags.join(', ')}*/}


                                                <Grid container
                                                      spacing={1}
                                                      direction="row"
                                                      justify="flex-start"
                                                      alignItems="center">

                                                    {ArrayStreams
                                                        .ofMapValues(row.tags || {})
                                                        .collect()
                                                        .map(current => (
                                                            <Grid item
                                                                  key={current.id}>

                                                                <Chip size="small"
                                                                      label={current.label}
                                                                      />

                                                            </Grid>
                                                    ))}

                                                </Grid>
                                            </TableCell>
                                            <TableCell
                                                padding="none"
                                            >
                                                <progress value={row.progress} max={100}/>
                                            </TableCell>

                                            <TableCell align="right"
                                                       padding="none"
                                            >
                                                <div onClick={event => {
                                                        // don't allow these events
                                                        // to ALSO select the row.
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                    }}>
                                                    <DocButtons/>

                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}
