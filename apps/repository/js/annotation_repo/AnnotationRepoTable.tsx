import * as React from 'react';
import ReactTable from "react-table";
import {Footer, Tips} from '../Utils';
import {Logger} from '../../../../web/js/logger/Logger';
import {AppState} from '../AppState';
import {RepoDocInfo} from '../RepoDocInfo';
import {Tag} from '../../../../web/js/tags/Tag';
import {Tags} from '../../../../web/js/tags/Tags';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {MessageBanner} from '../MessageBanner';
import {TableColumns} from '../TableColumns';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher, SimpleReactor} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoHeader} from '../RepoHeader';

const log = Logger.create();

export default class AnnotationRepoTable extends React.Component<IProps, IState> {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;

        this.state = {
            data: [],
            columns: new TableColumns()
        };

    }

    public refresh() {
        // noop
    }

    public highlightRow(selected: number) {

        const state: AppState = Object.assign({}, this.state);
        state.selected = selected;

        this.setState(state);

    }

    public render() {
        const { data } = this.state;
        return (

            <div id="doc-repo-table">

                <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                <MessageBanner/>

                <div id="doc-table">
                <ReactTable
                    data={data}
                    columns={
                        [
                            {
                                Header: '',
                                accessor: 'title',
                                Cell: (row: any) => {
                                    const id = 'annotation-title' + row.index;
                                    return (
                                        <div id={id}>

                                            <div>{row.text}</div>

                                        </div>

                                    );
                                }

                            },
                            {
                                Header: 'Created',
                                // accessor: (row: any) => row.added,
                                accessor: 'created',
                                show: true,
                                maxWidth: 100,
                                defaultSortDesc: true,
                                Cell: (row: any) => (
                                    <DateTimeTableCell className="doc-col-last-updated" datetime={row.created}/>
                                )

                            },
                            {
                                id: 'tags',
                                Header: 'Tags',
                                accessor: '',
                                show: true,
                                Cell: (row: any) => {

                                    const tags: {[id: string]: Tag} = row.original.tags;

                                    const formatted = Object.values(tags)
                                        .map(tag => tag.label)
                                        .sort()
                                        .join(", ");

                                    return (
                                        <div>{formatted}</div>
                                    );

                                }
                            },

                        ]}

                    defaultPageSize={25}
                    noDataText="No annotations available."
                    className="-striped -highlight"
                    defaultSorted={[
                        {
                            id: "progress",
                            desc: true
                        }
                    ]}
                    // sorted={[{
                    //     id: 'added',
                    //     desc: true
                    // }]}
                    getTrProps={(state: any, rowInfo: any) => {
                        return {

                            onClick: (e: any) => {
                                this.highlightRow(rowInfo.index as number);
                            },

                            style: {
                                background: rowInfo && rowInfo.index === this.state.selected ? '#00afec' : 'white',
                                color: rowInfo && rowInfo.index === this.state.selected ? 'white' : 'black',
                            }
                        };
                    }}
                    getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {

                        const singleClickColumns: string[] = [];

                        if (! singleClickColumns.includes(column.id)) {
                            return {
                                onDoubleClick: (e: any) => {
                                    // this.onDocumentLoadRequested(rowInfo.original.fingerprint,
                                    //                              rowInfo.original.filename,
                                    //                              rowInfo.original.hashcode);
                                }
                            };
                        }

                        if (singleClickColumns.includes(column.id)) {

                            return {

                                onClick: ((e: any, handleOriginal?: () => void) => {
                                    //
                                    // this.handleToggleField(rowInfo.original, column.id)
                                    //     .catch(err => log.error("Could not handle toggle: ", err));

                                    if (handleOriginal) {
                                        // needed for react table to function
                                        // properly.
                                        handleOriginal();
                                    }

                                })

                            };

                        }

                        return {};

                    }}

                />
                <br />
                <Tips />
                <Footer/>

                </div>

            </div>

        );
    }

    private refreshState(repoDocs: RepoDocInfo[]) {

        const state: AppState = Object.assign({}, this.state);

        state.data = repoDocs;

        setTimeout(() => {

            // The react table will not update when I change the state from
            // within the event listener
            this.setState(state);

        }, 1);

    }

}

interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

}

interface IState {

    // docs: DocDetail[];

    data: RepoDocInfo[];
    columns: TableColumns;
    selected?: number;
}

