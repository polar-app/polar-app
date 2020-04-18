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
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {arrayStream, ArrayStreams} from "polar-shared/src/util/ArrayStreams";
import {Preconditions} from "polar-shared/src/Preconditions";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Sorting} from "./Sorting";
import { EnhancedTableToolbar } from './EnhancedTableToolbar';
import {EnhancedTableHead} from "./EnhancedTableHead";
import {ContextMenuHandler, MUIDocContextMenu} from "./MUIDocContextMenu";
import {MUIDocButtonBar} from "./MUIDocButtonBar";
import {COLUMN_MAP, DOC_BUTTON_COLUMN_WIDTH} from "./Columns";
import {Tags} from "polar-shared/src/tags/Tags";
import {DocActions} from "./DocActions";
import {AutoBlur} from "./AutoBlur";
import {SelectRowType} from "../../../../apps/repository/js/doc_repo/DocRepoScreen";
import {DocRepoTableRow} from "./DocRepoTableRow";

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
            minWidth: 0,
            maxWidth: '100%',
            tableLayout: 'fixed'
        },
        tr: {
            // borderSpacing: '100px'
        },
        td: {
            whiteSpace: 'nowrap'
        },
        progress: {
            width: COLUMN_MAP.progress.width
        },
        colProgress: {
            width: COLUMN_MAP.progress.width,
            minWidth: COLUMN_MAP.progress.width
        },
        colAdded: {
            whiteSpace: 'nowrap',
            width: COLUMN_MAP.added.width,
        },
        colLastUpdated: {
            whiteSpace: 'nowrap',
            width: COLUMN_MAP.lastUpdated.width,
        },
        colTitle: {
            width: COLUMN_MAP.title.width,

            overflow: 'hidden',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            textOverflow: 'ellipsis'
        },
        colTags: {
            width: COLUMN_MAP.tags.width,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            textOverflow: 'ellipsis'
        },
        colDocButtons: {
            width: DOC_BUTTON_COLUMN_WIDTH
        },
        docButtons: {
            marginLeft: '5px',
            marginRight: '5px',
            display: 'flex',
            justifyContent: 'flex-end'
        }

    }),
);

interface IProps extends DocActions.DocContextMenu.Callbacks {

    readonly data: ReadonlyArray<RepoDocInfo>;

    readonly selected: ReadonlyArray<number>;

    // called when the user wants to view a doc
    readonly onLoadDoc: (repoDocInfo: RepoDocInfo) => void;

    readonly selectRow: (index: number, event: React.MouseEvent, type: SelectRowType) => void;

}

export default function DocumentRepositoryTable(props: IProps) {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Sorting.Order>('desc');
    const [orderBy, setOrderBy] = React.useState<keyof RepoDocInfo>('progress');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const {selected} = props;
    let {data} = props;

    Preconditions.assertPresent(data, 'data');

    const selectedProvider = (): ReadonlyArray<RepoDocInfo> => {
        return arrayStream(selected)
            .map(current => data[current])
            .collect();
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>,
                               property: keyof RepoDocInfo,
                               order: Sorting.Order) => {
        setOrder(order);
        setOrderBy(property);
    };

    const handleSelectAllRows = (selected: boolean) => {
        // if (selected) {
        //     // TODO: migrate to using an ID not a title.
        //     const newSelected = data.map((n) => n.fingerprint);
        //     setSelected(newSelected);
        //     return;
        // }
        // setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {

        // const selectedIndex = selected.indexOf(id);
        // let newSelected: string[] = [];
        //
        // if (selectedIndex === -1) {
        //     newSelected = newSelected.concat(selected, id);
        // } else if (selectedIndex === 0) {
        //     newSelected = newSelected.concat(selected.slice(1));
        // } else if (selectedIndex === selected.length - 1) {
        //     newSelected = newSelected.concat(selected.slice(0, -1));
        // } else if (selectedIndex > 0) {
        //     newSelected = newSelected.concat(
        //         selected.slice(0, selectedIndex),
        //         selected.slice(selectedIndex + 1),
        //     );
        // }
        //
        // setSelected(newSelected);

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

    const isSelected = (viewIndex: number) => selected.indexOf(viewIndex) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    // TODO: refactor this to be more functional
    data = Sorting.stableSort(data, Sorting.getComparator(order, orderBy));

    const docContextMenuCallbacks: DocActions.DocContextMenu.Callbacks = {

        onOpen: NULL_FUNCTION,
        onRename: NULL_FUNCTION,
        onShowFile: NULL_FUNCTION,
        onCopyOriginalURL: NULL_FUNCTION,
        onDelete: NULL_FUNCTION,
        onCopyDocumentID: NULL_FUNCTION,
        onCopyFilePath: NULL_FUNCTION,
        onFlagged: NULL_FUNCTION,
        onArchived: NULL_FUNCTION,

    };

    // FIXME: the context menu handler should select the current row

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} style={{display: 'flex', flexDirection: 'column'}}>
                <MUIDocContextMenu {...docContextMenuCallbacks}
                                   selectedProvider={selectedProvider}
                                   render={rawContextMenuHandler => {

                    return (
                        <>
                            <EnhancedTableToolbar data={data}
                                                  selectedProvider={selectedProvider}
                                                  numSelected={selected.length}
                                                  rowsPerPage={rowsPerPage}
                                                  onChangePage={handleChangePage}
                                                  onChangeRowsPerPage={handleChangeRowsPerPage}
                                                  onSelectAllRows={handleSelectAllRows}
                                                  page={page}
                                                  onDelete={() => console.log('FIXME: DELETE ==============' + Date.now())}
                                                  onFlagged={() => console.log('FIXME: FLAGGED ==============' + Date.now())}
                                                  onArchived={() => console.log('FIXME: ARCHIVED ==============' + Date.now())}
                                                  />

                            <TableContainer style={{flexGrow: 1}}>
                                <Table
                                    stickyHeader
                                    className={classes.table}
                                    aria-labelledby="tableTitle"
                                    size={'medium'}
                                    aria-label="enhanced table"
                                >
                                    <EnhancedTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                    />
                                    <TableBody>
                                        {data
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, viewIndex) => {

                                                return (
                                                    <DocRepoTableRow viewIndex={viewIndex}
                                                                     rawContextMenuHandler={rawContextMenuHandler}
                                                                     selectRow={props.selectRow}
                                                                     isSelected={isSelected}
                                                                     onLoadDoc={props.onLoadDoc}
                                                                     row={row}
                                                                     selectedProvider={selectedProvider}
                                                                     />
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
                        </>
                    );
                }}/>

            </Paper>
        </div>
    );
};
