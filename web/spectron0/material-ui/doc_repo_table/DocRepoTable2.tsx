import React, {useEffect} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {Sorting} from "./Sorting";
import {EnhancedTableToolbar} from './EnhancedTableToolbar';
import {EnhancedTableHead} from "./EnhancedTableHead";
import {MUIDocContextMenu} from "./MUIDocContextMenu";
import {DocRepoTableRow} from "./DocRepoTableRow";
import {MUIDialogController} from "../dialogs/MUIDialogController";
import {
    useDocRepoCallbacks,
    useDocRepoStore
} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import isEqual from "react-fast-compare";

export const DocRepoTable2 = React.memo(() => {

    const store = useDocRepoStore();
    const callbacks = useDocRepoCallbacks();

    const {order, orderBy, page, rowsPerPage, view, viewPage, selected} = store;
    const {setPage} = callbacks;

    const dense = true;

    const handleRequestSort = (event: React.MouseEvent<unknown>,
                               property: keyof RepoDocInfo,
                               order: Sorting.Order) => {
    //
    //     setOrder(order, property);
    //     this.props.selectRows([]);
    //
    };

    const handleSelectAllRows = (selected: boolean) => {

        // if (selected) {
        //     const start = page * rowsPerPage;
        //     const end = Math.min(data.length, start + rowsPerPage);
        //     this.props.selectRows(Numbers.range(start, end));
        //     return;
        // }
        //
        // this.props.selectRows([]);

    };

    const handleChangeRowsPerPage = (rowsPerPage: number) => {
        // this.setState({
        //     ...this.state,
        //     rowsPerPage,
        //     page: 0
        // });
        //
        // this.props.selectRows([]);
        //
    };

    const emptyRows = rowsPerPage - viewPage.length;

    return (
        <div style={{
                width: '100%',
                height: '100%'
             }}>
            <Paper square
                   style={{
                       width: '100%',
                       height: '100%',
                       display: 'flex',
                       flexDirection: 'column'
                   }}>
                <MUIDialogController>
                        <MUIDocContextMenu render={rawContextMenuHandler => {

                        return (
                            <>
                                {/*FIXME: some of these don't need to be passed as I can use store and actions*/}
                                <EnhancedTableToolbar onChangePage={setPage}
                                                      onChangeRowsPerPage={handleChangeRowsPerPage}
                                                      onSelectAllRows={handleSelectAllRows}
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
                                        aria-label="enhanced table">

                                        <EnhancedTableHead/>

                                        <TableBody>
                                            {viewPage
                                                .map((row, index) => {

                                                    const viewIndex = (page * rowsPerPage) + index;

                                                    return (
                                                        <DocRepoTableRow
                                                            viewIndex={viewIndex}
                                                            key={viewIndex}
                                                            rawContextMenuHandler={rawContextMenuHandler}
                                                            selected={selected.includes(viewIndex)}
                                                            row={row}
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
                </MUIDialogController>

            </Paper>
        </div>
    )

}, isEqual);
