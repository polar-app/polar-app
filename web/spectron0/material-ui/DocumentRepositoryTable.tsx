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

interface Doc {
    readonly title: string;
    readonly added: ISODateTimeString;
    readonly lastUpdated: ISODateTimeString;
    readonly tags: ReadonlyArray<string>;
    readonly progress: number;
}

function createDoc(title: string,
                   added: ISODateTimeString,
                   lastUpdated: ISODateTimeString,
                   tags: ReadonlyArray<string>,
                   progress: number): Doc {

    return { title: title + ": " + Math.random(), added, lastUpdated, tags, progress };

}

const now = new Date();
const today = ISODateTimeStrings.create();
const yesterday = ISODateTimeStrings.create(TimeDurations.compute('-1d', now));

const rows = [

    createDoc('Cupcake', yesterday, today, ['linux', 'microsoft'], 4.3),
    createDoc('Donut', yesterday, today, [], 4.9),
    createDoc('Eclair', yesterday, today, ['linux', 'google'], 6.0),
    createDoc('Frozen yoghurt', yesterday, today, ['google', 'intel'], 4.0),
    createDoc('Gingerbread', yesterday, today, ['cloud', 'aws'], 3.9),
    createDoc('Honeycomb', yesterday, today, ['amazon', 'aws'], 6.5),
    createDoc('Ice cream sandwich', yesterday, today, ['microsoft', 'amazon'], 4.3),
    createDoc('Jelly Bean', yesterday, today, ['microsoft', 'aws', 'cloud'], 0.0),
    createDoc('KitKat', yesterday, today, ['intel', 'cloud'], 7.0),
    createDoc('Lollipop', yesterday, today, ['internet', 'microsoft'], 0.0),
    createDoc('Marshmallow', yesterday, today, ['sanfrancisco', 'investors'], 2.0),
    createDoc('Nougat', yesterday, today, ['boulder', 'startups'], 37.0),
    createDoc('Oreo', yesterday, today, ['startups'], 4.0),

    createDoc('Cupcake', yesterday, today, ['linux', 'microsoft'], 4.3),
    createDoc('Donut', yesterday, today, [], 4.9),
    createDoc('Eclair', yesterday, today, ['linux', 'google'], 6.0),
    createDoc('Frozen yoghurt', yesterday, today, ['google', 'intel'], 4.0),
    createDoc('Gingerbread', yesterday, today, ['cloud', 'aws'], 3.9),
    createDoc('Honeycomb', yesterday, today, ['amazon', 'aws'], 6.5),
    createDoc('Ice cream sandwich', yesterday, today, ['microsoft', 'amazon'], 4.3),
    createDoc('Jelly Bean', yesterday, today, ['microsoft', 'aws', 'cloud'], 0.0),
    createDoc('KitKat', yesterday, today, ['intel', 'cloud'], 7.0),
    createDoc('Lollipop', yesterday, today, ['internet', 'microsoft'], 0.0),
    createDoc('Marshmallow', yesterday, today, ['sanfrancisco', 'investors'], 2.0),
    createDoc('Nougat', yesterday, today, ['boulder', 'startups'], 37.0),
    createDoc('Oreo', yesterday, today, ['startups'], 4.0),

    createDoc('Cupcake', yesterday, today, ['linux', 'microsoft'], 4.3),
    createDoc('Donut', yesterday, today, [], 4.9),
    createDoc('Eclair', yesterday, today, ['linux', 'google'], 6.0),
    createDoc('Frozen yoghurt', yesterday, today, ['google', 'intel'], 4.0),
    createDoc('Gingerbread', yesterday, today, ['cloud', 'aws'], 3.9),
    createDoc('Honeycomb', yesterday, today, ['amazon', 'aws'], 6.5),
    createDoc('Ice cream sandwich', yesterday, today, ['microsoft', 'amazon'], 4.3),
    createDoc('Jelly Bean', yesterday, today, ['microsoft', 'aws', 'cloud'], 0.0),
    createDoc('KitKat', yesterday, today, ['intel', 'cloud'], 7.0),
    createDoc('Lollipop', yesterday, today, ['internet', 'microsoft'], 0.0),
    createDoc('Marshmallow', yesterday, today, ['sanfrancisco', 'investors'], 2.0),
    createDoc('Nougat', yesterday, today, ['boulder', 'startups'], 37.0),
    createDoc('Oreo', yesterday, today, ['startups'], 4.0),

    createDoc('Cupcake', yesterday, today, ['linux', 'microsoft'], 4.3),
    createDoc('Donut', yesterday, today, [], 4.9),
    createDoc('Eclair', yesterday, today, ['linux', 'google'], 6.0),
    createDoc('Frozen yoghurt', yesterday, today, ['google', 'intel'], 4.0),
    createDoc('Gingerbread', yesterday, today, ['cloud', 'aws'], 3.9),
    createDoc('Honeycomb', yesterday, today, ['amazon', 'aws'], 6.5),
    createDoc('Ice cream sandwich', yesterday, today, ['microsoft', 'amazon'], 4.3),
    createDoc('Jelly Bean', yesterday, today, ['microsoft', 'aws', 'cloud'], 0.0),
    createDoc('KitKat', yesterday, today, ['intel', 'cloud'], 7.0),
    createDoc('Lollipop', yesterday, today, ['internet', 'microsoft'], 0.0),
    createDoc('Marshmallow', yesterday, today, ['sanfrancisco', 'investors'], 2.0),
    createDoc('Nougat', yesterday, today, ['boulder', 'startups'], 37.0),
    createDoc('Oreo', yesterday, today, ['startups'], 4.0),

    createDoc('Cupcake', yesterday, today, ['linux', 'microsoft'], 4.3),
    createDoc('Donut', yesterday, today, [], 4.9),
    createDoc('Eclair', yesterday, today, ['linux', 'google'], 6.0),
    createDoc('Frozen yoghurt', yesterday, today, ['google', 'intel'], 4.0),
    createDoc('Gingerbread', yesterday, today, ['cloud', 'aws'], 3.9),
    createDoc('Honeycomb', yesterday, today, ['amazon', 'aws'], 6.5),
    createDoc('Ice cream sandwich', yesterday, today, ['microsoft', 'amazon'], 4.3),
    createDoc('Jelly Bean', yesterday, today, ['microsoft', 'aws', 'cloud'], 0.0),
    createDoc('KitKat', yesterday, today, ['intel', 'cloud'], 7.0),
    createDoc('Lollipop', yesterday, today, ['internet', 'microsoft'], 0.0),
    createDoc('Marshmallow', yesterday, today, ['sanfrancisco', 'investors'], 2.0),
    createDoc('Nougat', yesterday, today, ['boulder', 'startups'], 37.0),
    createDoc('Oreo', yesterday, today, ['startups'], 4.0),



];

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

function getComparator<Key extends keyof any>(order: Order,
                                              orderBy: Key): (a: { [key in Key]: number | string | ReadonlyArray<string> },
                                                              b: { [key in Key]: number | string | ReadonlyArray<string> }) => number {

    // TODO: this is kind of ugly in that it specifices a NEGATIVE value andit's
    // not completely clear.

    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);

}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Doc;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
    { id: 'added', numeric: false, disablePadding: false, label: 'Added' },
    { id: 'lastUpdated', numeric: false, disablePadding: false, label: 'Last Updated' },
    { id: 'tags', numeric: true, disablePadding: false, label: 'Tags' },
    { id: 'progress', numeric: true, disablePadding: false, label: 'Progress' },
];

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Doc) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof Doc) => (event: React.MouseEvent<unknown>) => {
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
    readonly numSelected: number;
    readonly page: number;
    readonly rowsPerPage: number;
    readonly onChangePage: (page: number) => void;
    readonly onChangeRowsPerPage: (rowsPerPAge: number) => void;
}


const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const classes = useToolbarStyles();
    const { numSelected, rowsPerPage, page } = props;

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
                                //     onChange={onSelectAllClick}

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
                count={rows.length}
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

export default function DocumentRepositoryTable() {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<keyof Doc>('progress');
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Doc) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.title);
            setSelected(newSelecteds);
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    stableSort(rows, getComparator(order, orderBy))
        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} style={{display: 'flex', flexDirection: 'column'}}>
                <EnhancedTableToolbar numSelected={selected.length}
                                      rowsPerPage={rowsPerPage}
                                      onChangePage={handleChangePage}
                                      onChangeRowsPerPage={handleChangeRowsPerPage}
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
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
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
                                                    {row.tags.map(current => (
                                                        <Grid item key={current}>
                                                            <Chip size="small"
                                                                  label={current}
                                                                  />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </TableCell>
                                            <TableCell>
                                                <progress value={row.progress} max={100}/>
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
