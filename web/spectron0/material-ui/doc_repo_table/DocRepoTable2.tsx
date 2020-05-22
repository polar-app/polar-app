import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import {EnhancedTableToolbar} from './EnhancedTableToolbar';
import {EnhancedTableHead} from "./EnhancedTableHead";
import {MUIDocContextMenu} from "./MUIDocContextMenu";
import {DocRepoTableRow} from "./DocRepoTableRow";
import {MUIDialogController} from "../../../js/mui/dialogs/MUIDialogController";
import {useDocRepoStore} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import isEqual from "react-fast-compare";
import {DocRepoGlobalHotKeys} from "./DocRepoGlobalHotKeys";

export const DocRepoTable2 = React.memo(() => {

    const store = useDocRepoStore();
    const {page, rowsPerPage, viewPage, selected} = store;

    const dense = true;

    const emptyRows = rowsPerPage - viewPage.length;

    return (
        <div style={{
                width: '100%',
                height: '100%'
             }}>

            <DocRepoGlobalHotKeys/>

            <Paper square
                   elevation={0}
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
                                <EnhancedTableToolbar />

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
                                                            selected={selected.includes(row.id)}
                                                            row={row}
                                                        />
                                                    );
                                                })}
                                            {/*FIXME: I think we should show that the user*/}
                                            {/*has N more archived documents here that we */}
                                            {/*can show them*/}
                                            {/*{emptyRows > 0 && (*/}
                                            {/*    <TableRow*/}
                                            {/*        style={{height: (dense ? 33 : 53) * emptyRows}}>*/}
                                            {/*        <TableCell colSpan={6}/>*/}
                                            {/*    </TableRow>*/}
                                            {/*)}*/}
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
