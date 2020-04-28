import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {Callback1, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Sorting} from "./Sorting";
import {EnhancedTableToolbar} from './EnhancedTableToolbar';
import {EnhancedTableHead} from "./EnhancedTableHead";
import {MUIDocContextMenu} from "./MUIDocContextMenu";
import {SelectRowType} from "../../../../apps/repository/js/doc_repo/DocRepoScreen";
import {DocRepoTableRow} from "./DocRepoTableRow";
import {Provider} from "polar-shared/src/util/Providers";
import {Tag} from "polar-shared/src/tags/Tags";
import {RelatedTagsManager} from "../../../js/tags/related/RelatedTagsManager";
import {
    MUIDialogController
} from "../dialogs/MUIDialogController";
import {
    useDocRepoActions,
    useDocRepoStore
} from "../../../../apps/repository/js/doc_repo/DocRepoStore";
import {useDialogManager} from "../dialogs/MUIDialogControllers";

interface IProps {

    readonly data: ReadonlyArray<RepoDocInfo>;

    readonly selected: ReadonlyArray<number>;

    readonly selectRow: (index: number, event: React.MouseEvent, type: SelectRowType) => void;

    readonly selectRows: (selected: ReadonlyArray<number>) => void;

    readonly tagsProvider: Provider<ReadonlyArray<Tag>>;

    readonly relatedTagsManager: RelatedTagsManager;

    readonly onTagged: (repoDocInfos: ReadonlyArray<RepoDocInfo>, tags: ReadonlyArray<Tag>) => void;

    readonly onDragStart?: (event: DragEvent) => void;
    readonly onDragEnd?: (event: DragEvent) => void;

    readonly onOpen: Callback1<RepoDocInfo>;
    readonly onRename: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly onShowFile: Callback1<RepoDocInfo>;
    readonly onCopyOriginalURL: Callback1<RepoDocInfo>;
    readonly onCopyFilePath: Callback1<RepoDocInfo>;
    readonly onCopyDocumentID: Callback1<RepoDocInfo>;
    readonly onDeleted: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly onArchived: Callback1<ReadonlyArray<RepoDocInfo>>;
    readonly onFlagged: Callback1<ReadonlyArray<RepoDocInfo>>;

}

export const DocRepoTable2 = React.memo(() => {

    const state = useDocRepoStore();
    const actions = useDocRepoActions();

    const {order, orderBy, page, rowsPerPage, view, viewPage, selected} = state;

    const {selectedProvider, selectRow} = actions;

    const dense = true;

    const setOrder = (order: Sorting.Order, orderBy: keyof RepoDocInfo) => {
        // this.setState({
        //     ...this.state,
        //     page: 0,
        //     order,
        //     orderBy
        // })
    };

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
                        <MUIDocContextMenu {...actions}
                                           render={rawContextMenuHandler => {

                        return (
                            <>
                                {/*FIXME: some of these don't need to be passed as I can use store and actions*/}
                                <EnhancedTableToolbar onChangePage={actions.setPage}
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

                                        <EnhancedTableHead
                                            order={order}
                                            orderBy={orderBy}
                                            onRequestSort={handleRequestSort}/>

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

});


    // private selectedProvider(): ReadonlyArray<RepoDocInfo> {
    //     // FIXME this isn't the sorted data (the view)
    //     return arrayStream(this.props.selected)
    //         .map(current => this.view[current])
    //         .collect();
    // }
    //
    // private isSelected(viewIndex: number): boolean {
    //     return this.props.selected.indexOf(viewIndex) !== -1;
    // };
    //

    //
    //
    // private onArchived(repoDocInfos: ReadonlyArray<RepoDocInfo>) {
    //
    //     if (repoDocInfos.length === 0) {
    //         return;
    //     }
    //
    //     this.dialogs!.confirm({
    //         title: "Are you sure you want to archive these document(s)?",
    //         subtitle: "They won't be deleted but will be hidden by default..",
    //         onCancel: NULL_FUNCTION,
    //         type: 'warning',
    //         onAccept: () => this.props.onArchived(repoDocInfos),
    //     });
    //
    // }
    //
    // private onRename(repoDocInfo: RepoDocInfo) {
    //
    //     this.dialogs!.prompt({
    //         title: "Enter a new title for the document:",
    //         defaultValue: repoDocInfo.title,
    //         onCancel: NULL_FUNCTION,
    //         onDone: (value) => this.props.onRename(repoDocInfo, value)

    //     });
    //
    // }
//
// };
