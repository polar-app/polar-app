import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import {DateTimeTableCell} from "../../../../apps/repository/js/DateTimeTableCell";
import {DocButtons} from "../DocButtonsDemo";
import {RepoDocInfo} from ".././../../../apps/repository/js/RepoDocInfo";
import {arrayStream, ArrayStreams} from "polar-shared/src/util/ArrayStreams";
import {Preconditions} from "polar-shared/src/Preconditions";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Order, stableSort, getComparator} from "./Sorting";
import { EnhancedTableToolbar } from './EnhancedTableToolbar';
import {EnhancedTableHead} from "./EnhancedTableHead";

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
        tr: {
            // borderSpacing: '100px'
        },
        td: {
            whitespace: 'nowrap'
        },
        colProgress: {
            width: '100px'
        },
        colTitle: {
            width: '100%'
        }

    }),
);

interface IProps {

    readonly data: ReadonlyArray<RepoDocInfo>;

    // called when the user wants to view a doc
    readonly onLoadDoc: (repoDocInfo: RepoDocInfo) => void;

}

export default function DocumentRepositoryTable(props: IProps) {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<keyof RepoDocInfo>('progress');
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    let {data} = props;

    Preconditions.assertPresent(data, 'data');

    const selectedProvider = (): ReadonlyArray<RepoDocInfo> => {
        return arrayStream(data)
            .filter(current => selected.includes(current.fingerprint))
            .collect();
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof RepoDocInfo) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllRows = (selected: boolean) => {
        if (selected) {
            // TODO: migrate to using an ID not a title.
            const newSelected = data.map((n) => n.fingerprint);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {

        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
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
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllRows}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.fingerprint);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        // <MUIDocDropdownContextMenu onClose={NULL_FUNCTION} key={row.fingerprint}>
                                            <TableRow
                                                hover
                                                className={classes.tr}
                                                onClick={(event) => event.stopPropagation()}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.fingerprint}
                                                onDoubleClick={() => props.onLoadDoc(row)}
                                                selected={isItemSelected}>

                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        inputProps={{'aria-labelledby': labelId}}
                                                        onClick={(event) => handleClick(event, row.fingerprint)}

                                                    />
                                                </TableCell>
                                                <TableCell component="th"
                                                           id={labelId}
                                                           scope="row"
                                                           className={classes.colTitle}
                                                           // padding="none"
                                                >
                                                    {row.title}
                                                </TableCell>
                                                <TableCell
                                                    className={classes.td}
                                                    padding="none"
                                                >
                                                    <DateTimeTableCell
                                                        datetime={row.added}/>
                                                </TableCell>
                                                <TableCell
                                                    className={classes.td}
                                                    padding="none"
                                                >
                                                    <DateTimeTableCell
                                                        datetime={row.lastUpdated}/>
                                                </TableCell>
                                                <TableCell
                                                    // padding="none"
                                                >

                                                    <Grid container
                                                          wrap="nowrap"
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
                                                <TableCell className={classes.colProgress}
                                                           padding="none">

                                                    <progress value={row.progress}
                                                              max={100}/>

                                                </TableCell>

                                                <TableCell align="right"
                                                           padding="none"
                                                           onClick={event => event.stopPropagation()}
                                                           onDoubleClick={event => event.stopPropagation()}>

                                                    <DocButtons flagged={row.flagged}
                                                                archived={row.archived}
                                                                onArchive={NULL_FUNCTION}
                                                                onFlag={NULL_FUNCTION}
                                                                onTag={NULL_FUNCTION}
                                                                onDropdown={NULL_FUNCTION}
                                                    />

                                                </TableCell>

                                            </TableRow>
                                        // </MUIDocDropdownContextMenu>

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
};
