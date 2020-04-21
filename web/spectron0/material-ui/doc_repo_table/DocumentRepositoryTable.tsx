import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Preconditions} from "polar-shared/src/Preconditions";
import {Callback1, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Sorting} from "./Sorting";
import {EnhancedTableToolbar} from './EnhancedTableToolbar';
import {EnhancedTableHead} from "./EnhancedTableHead";
import {MUIDocContextMenu} from "./MUIDocContextMenu";
import {DocActions} from "./DocActions";
import {SelectRowType} from "../../../../apps/repository/js/doc_repo/DocRepoScreen";
import {DocRepoTableRow} from "./DocRepoTableRow";
import {Numbers} from 'polar-shared/src/util/Numbers';
import {Dialogs} from "../../../js/ui/dialogs/Dialogs";
import {MUITagInputControls} from "../../../../apps/repository/js/MUITagInputControls";
import {Provider} from "polar-shared/src/util/Providers";
import {Tag} from "polar-shared/src/tags/Tags";
import {RelatedTagsManager} from "../../../js/tags/related/RelatedTagsManager";
import {
    DialogManager,
    MUIDialogController
} from "../dialogs/MUIDialogController";

interface IProps {

    readonly data: ReadonlyArray<RepoDocInfo>;

    readonly selected: ReadonlyArray<number>;

    readonly selectRow: (index: number, event: React.MouseEvent, type: SelectRowType) => void;

    readonly selectRows: (selected: ReadonlyArray<number>) => void;

    readonly tagsProvider: Provider<ReadonlyArray<Tag>>;

    readonly relatedTagsManager: RelatedTagsManager;

    readonly onTagged: (repoDocInfos: ReadonlyArray<RepoDocInfo>, tags: ReadonlyArray<Tag>) => void;

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

interface IState {
    readonly order: Sorting.Order;
    readonly orderBy: keyof RepoDocInfo;
    readonly page: number;
    readonly dense: boolean;
    readonly rowsPerPage: number;
}

export default class DocumentRepositoryTable extends React.Component<IProps, IState> {

    private callbacks: DocActions.DocContextMenu.Callbacks;
    private dialogs?: DialogManager;

    constructor(props: Readonly<IProps>) {
        super(props);

        this.selectedProvider = this.selectedProvider.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.onTagged = this.onTagged.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onArchived = this.onArchived.bind(this);
        this.onDeleted = this.onDeleted.bind(this);

        // keep a copy of JUST the callbacks so we can pass these without
        // breaking memoization
        this.callbacks = {

            onTagged: this.onTagged,
            onOpen: props.onOpen,
            onRename: this.onRename,
            onShowFile: props.onShowFile,
            onCopyOriginalURL: props.onCopyOriginalURL,
            onDeleted: this.onDeleted,
            onCopyDocumentID: props.onCopyDocumentID,
            onCopyFilePath: props.onCopyFilePath,
            onFlagged: this.props.onFlagged,
            onArchived: this.onArchived,

        };

        this.state = {
            order: 'desc',
            orderBy: 'progress',
            page: 0,
            dense: true,
            rowsPerPage: 25
        };

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

        const handleRequestSort = (event: React.MouseEvent<unknown>,
                                   property: keyof RepoDocInfo,
                                   order: Sorting.Order) => {

            setOrder(order, property);
        };

        const handleSelectAllRows = (selected: boolean) => {

            if (selected) {
                const start = page * rowsPerPage;
                const end = Math.min(data.length, start + rowsPerPage);
                this.props.selectRows(Numbers.range(start, end));
                return;
            }

            this.props.selectRows([]);

        };

        const handleChangePage = (newPage: number) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (rowsPerPage: number) => {
            this.setState({
                ...this.state,
                rowsPerPage,
                page: 0
            });
        };

        // const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        //     setDense(event.target.checked);
        // };

        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        data = Sorting.stableSort(data, Sorting.getComparator(order, orderBy));

        const pageData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                    <MUIDialogController render={dialogs => {

                        this.dialogs = dialogs;

                        return (
                            <MUIDocContextMenu {...this.callbacks}
                                               selectedProvider={this.selectedProvider}
                                               render={rawContextMenuHandler => {

                            return (
                                <>
                                    <EnhancedTableToolbar data={data}
                                                          selectedProvider={this.selectedProvider}
                                                          numSelected={selected.length}
                                                          rowsOnPage={pageData.length}
                                                          rowsPerPage={rowsPerPage}
                                                          onChangePage={handleChangePage}
                                                          onChangeRowsPerPage={handleChangeRowsPerPage}
                                                          onSelectAllRows={handleSelectAllRows}
                                                          page={page}
                                                          onTagged={NULL_FUNCTION}
                                                          onDelete={this.callbacks.onDeleted}
                                                          onFlagged={this.callbacks.onFlagged}
                                                          onArchived={this.callbacks.onArchived}/>

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
                                                {pageData
                                                    .map((row, index) => {

                                                        const viewIndex = (page * rowsPerPage) + index;

                                                        return (
                                                            <DocRepoTableRow
                                                                viewIndex={viewIndex}
                                                                key={viewIndex}
                                                                rawContextMenuHandler={rawContextMenuHandler}
                                                                selectRow={this.props.selectRow}
                                                                selected={this.isSelected(viewIndex)}
                                                                {...this.callbacks}
                                                                onTagged={this.onTagged}
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

                        );

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

    private onTagged(repoDocInfos: ReadonlyArray<RepoDocInfo>) {

        const availableTags = this.props.tagsProvider();

        // FIXME: not sure how we should handle this...  adding NEW tags
        // to existing items.

        const existingTags = repoDocInfos.length === 1 ? Object.values(repoDocInfos[0].tags || {}) : [];

        MUITagInputControls.prompt({
            availableTags,
            existingTags: () => existingTags,
            relatedTagsManager: this.props.relatedTagsManager,
            onChange: NULL_FUNCTION,
            onCancel: NULL_FUNCTION,
            onDone: tags => this.props.onTagged(repoDocInfos, tags)
        });

    }

    private onDeleted(repoDocInfos: ReadonlyArray<RepoDocInfo>) {

        if (repoDocInfos.length === 0) {
            return;
        }

        this.dialogs!.confirm({
            title: "Are you sure you want to delete these document(s)?",
            subtitle: "This is a permanent operation and can't be undone.  All associated annotations will also be removed.",
            onCancel: NULL_FUNCTION,
            type: 'danger',
            onAccept: () => this.props.onDeleted(repoDocInfos),
        });

    }

    private onArchived(repoDocInfos: ReadonlyArray<RepoDocInfo>) {

        if (repoDocInfos.length === 0) {
            return;
        }

        this.dialogs!.confirm({
            title: "Are you sure you want to archive these document(s)?",
            subtitle: "They won't be deleted but will be hidden by default..",
            onCancel: NULL_FUNCTION,
            type: 'warning',
            onAccept: () => this.props.onArchived(repoDocInfos),
        });

    }

    private onRename(repoDocInfo: RepoDocInfo) {

        this.dialogs!.prompt({
            title: "Enter a new title for the document:",
            defaultValue: repoDocInfo.title,
            onCancel: NULL_FUNCTION,
            onDone: (value) => this.props.onRename(repoDocInfo, value)
        });

    }

};
