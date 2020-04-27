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
    MUIDialogController,
    useDialogManager
} from "../dialogs/MUIDialogController";
import {
    useDocRepoActions,
    useDocRepoStore
} from "../../../../apps/repository/js/doc_repo/DocRepoStore";

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

export const DocRepoTable2 = () => {

    const state = useDocRepoStore();
    const actions = useDocRepoActions();
    const dialogs = useDialogManager();

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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, view.length - page * rowsPerPage);

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
                                <EnhancedTableToolbar data={view}
                                                      // selectedProvider={selectedProvider}
                                                      selectedProvider={() => []}
                                                      numSelected={selected.length}
                                                      rowsOnPage={viewPage.length}
                                                      onChangePage={actions.setPage}
                                                      onChangeRowsPerPage={handleChangeRowsPerPage}
                                                      onSelectAllRows={handleSelectAllRows}
                                                      page={page}
                                                      // onTagged={this.callbacks.onTagged}
                                                      // onDelete={this.callbacks.onDeleted}
                                                      // onFlagged={this.callbacks.onFlagged}
                                                      // onArchived={this.callbacks.onArchived}
                                                      onTagged={NULL_FUNCTION}
                                                      onDelete={NULL_FUNCTION}
                                                      onFlagged={NULL_FUNCTION}
                                                      onArchived={NULL_FUNCTION}

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
                                                            selectRow={selectRow}
                                                            selected={selected.includes(viewIndex)}
                                                            {...actions}
                                                            row={row}
                                                            selectedProvider={selectedProvider}
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

};


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
    // private onTagged(repoDocInfos: ReadonlyArray<RepoDocInfo>) {
    //
    //     console.log("FIXME: tagging: ", repoDocInfos);
    //
    //     const availableTags = this.props.tagsProvider();
    //
    //     const existingTags = repoDocInfos.length === 1 ? Object.values(repoDocInfos[0].tags || {}) : [];
    //
    //     const toAutocompleteOption = MUITagInputControls.toAutocompleteOption;
    //
    //     const {relatedTagsManager, tagsProvider} = this.props;
    //
    //     const relatedOptionsCalculator = (tags: ReadonlyArray<Tag>) => {
    //
    //         // TODO convert this to NOT use tag strings but to use tag objects
    //
    //         const computed = relatedTagsManager.compute(tags.map(current => current.id))
    //                                            .map(current => current.tag);
    //
    //         // now look this up directly.
    //         const resolved = arrayStream(tagsProvider())
    //             .filter(current => computed.includes(current.id))
    //             .map(toAutocompleteOption)
    //             .collect();
    //
    //         return resolved;
    //
    //     };
    //
    //     const autocompleteProps: AutocompleteDialogProps<Tag> = {
    //         title: "Assign Tags to Document",
    //         options: availableTags.map(toAutocompleteOption),
    //         defaultOptions: existingTags.map(toAutocompleteOption),
    //         createOption: MUITagInputControls.createOption,
    //         // FIXME: add back in related tags...
    //         // relatedOptionsCalculator: (tags) => this.props.relatedTagsManager.compute(tags),
    //         // relatedOptionsCalculator: (tags) => [],
    //         relatedOptionsCalculator,
    //         onCancel: NULL_FUNCTION,
    //         onChange: NULL_FUNCTION,
    //         onDone: tags => this.props.onTagged(repoDocInfos, tags)
    //     };
    //
    //     this.dialogs!.autocomplete(autocompleteProps);
    //
    // }
    //
    // private onDeleted(repoDocInfos: ReadonlyArray<RepoDocInfo>) {
    //
    //     // FIXME copy over the AppInitializer timings.
    //
    //     // REFACTOR: rework these methods into dedicated callbacks.
    //
    //     if (repoDocInfos.length === 0) {
    //         return;
    //     }
    //
    //     this.dialogs!.confirm({
    //         title: "Are you sure you want to delete these document(s)?",
    //         subtitle: "This is a permanent operation and can't be undone.  All associated annotations will also be removed.",
    //         onCancel: NULL_FUNCTION,
    //         type: 'danger',
    //         onAccept: () => this.props.onDeleted(repoDocInfos),
    //     });
    //
    // }
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
