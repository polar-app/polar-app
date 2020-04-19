import React from 'react';
import {
    createStyles,
    makeStyles,
    Theme,
    withStyles
} from '@material-ui/core/styles';
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

const styles = {
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

};

interface IProps extends DocActions.DocContextMenu.Callbacks {

    readonly data: ReadonlyArray<RepoDocInfo>;

    readonly selected: ReadonlyArray<number>;

    // called when the user wants to view a doc
    readonly onLoadDoc: (repoDocInfo: RepoDocInfo) => void;

    readonly selectRow: (index: number, event: React.MouseEvent, type: SelectRowType) => void;

}

interface IState {
    readonly order: Sorting.Order;
    readonly orderBy: keyof RepoDocInfo;
    readonly page: number;
    readonly dense: boolean;
    readonly rowsPerPage: number;
}

export default class DocumentRepositoryTable extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);

        this.selectedProvider = this.selectedProvider.bind(this);
        this.isSelected = this.isSelected.bind(this);

        this.state = {
            order: 'desc',
            orderBy: 'progress',
            page: 0,
            dense: true,
            rowsPerPage: 25
        }

    }

    public render() {


        const {order, orderBy, page, rowsPerPage, dense} = this.state;
        const {selected} = this.props;
        let {data} = this.props;

        Preconditions.assertPresent(data, 'data');

        const setOrder = (order: Sorting.Order, orderBy: keyof RepoDocInfo) => {
            this.setState({
                ...this.state,
                order, orderBy
            })
        };

        const setPage = (page: number) => {
            this.setState({
                ...this.state,
                page
            })
        };

        const setRowsPerPage = (rowsPerPage: number) => {
            this.setState({
                ...this.state,
                rowsPerPage
            });
        };

        const handleRequestSort = (event: React.MouseEvent<unknown>,
                                   property: keyof RepoDocInfo,
                                   order: Sorting.Order) => {

            setOrder(order, property);
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

        const handleChangePage = (newPage: number) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (rowsPerPage: number) => {
            // FIXME: set both of these as one call...
            setRowsPerPage(rowsPerPage);
            setPage(0);
        };

        // const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        //     setDense(event.target.checked);
        // };

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

        return (
            <div style={{
                    width: '100%',
                    height: '100%'
                 }}>
                <Paper style={{
                           width: '100%',
                           height: '100%',
                           display: 'flex',
                           flexDirection: 'column'
                       }}>
                    <MUIDocContextMenu {...docContextMenuCallbacks}
                                       selectedProvider={this.selectedProvider}
                                       render={rawContextMenuHandler => {

                    return (
                        <>
                            <EnhancedTableToolbar data={data}
                                                  selectedProvider={this.selectedProvider}
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
                                    style={{
                                        minWidth: 0,
                                        maxWidth: '100%',
                                        tableLayout: 'fixed'
                                    }}
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
                                                    <DocRepoTableRow
                                                        viewIndex={viewIndex}
                                                        key={viewIndex}
                                                        rawContextMenuHandler={rawContextMenuHandler}
                                                        selectRow={this.props.selectRow}
                                                        selected={this.isSelected(viewIndex)}
                                                        onLoadDoc={this.props.onLoadDoc}
                                                        row={row}
                                                        selectedProvider={this.selectedProvider}
                                                    />
                                                );
                                            })}
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{height: (dense ? 33 : 53) * emptyRows}}>
                                                <TableCell colSpan={6}/>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>);
                    }}/>

                </Paper>
            </div>
        );
    }

    private selectedProvider(): ReadonlyArray<RepoDocInfo> {
        return arrayStream(this.props.selected)
            .map(current => this.props.data[current])
            .collect();
    }

    private isSelected(viewIndex: number): boolean {
        return this.props.selected.indexOf(viewIndex) !== -1;
    };

};
