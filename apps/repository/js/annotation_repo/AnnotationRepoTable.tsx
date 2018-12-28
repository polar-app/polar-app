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
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher, SimpleReactor} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoHeader} from '../RepoHeader';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {PersistenceLayerManagers} from '../../../../web/js/datastore/PersistenceLayerManagers';
import {RepoDocMetaLoaders} from '../RepoDocMetaLoaders';
import {MultiReleaser} from '../../../../web/js/reactor/EventListener';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {HighlighterIcon} from '../../../../web/js/ui/standard_icons/HighlighterIcon';
import {ExtendedReactTable, IReactTableState} from '../util/ExtendedReactTable';
import {AnnotationIcon} from '../../../../web/js/ui/standard_icons/AnnotationIcon';

const log = Logger.create();

export default class AnnotationRepoTable extends ExtendedReactTable<IProps, IState> {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;

        this.state = {
            data: [],
        };

        this.init();
        this.refresh();

    }

    public init() {

        PersistenceLayerManagers.onPersistenceManager(this.props.persistenceLayerManager, (persistenceLayer) => {

            this.releaser.register(
                persistenceLayer.addEventListener(() => this.refresh()));

        });

        this.releaser.register(
            RepoDocMetaLoaders.addThrottlingEventListener(this.props.repoDocMetaLoader, () => this.refresh()));

    }

    public onSelected(selected: number,
                      repoAnnotation: RepoAnnotation) {

        this.setState({...this.state, selected});
        this.props.onSelected(repoAnnotation);

    }

    public render() {
        const { data } = this.state;

        return (

            <div id="doc-repo-table">

                <div id="doc-table">
                <ReactTable
                    data={data}
                    columns={
                        [
                            {
                                Header: '',
                                accessor: 'type',
                                maxWidth: 30,

                                Cell: (row: any) => {
                                    return (

                                        <div className="text-center">
                                            <AnnotationIcon type={row.original.type} color={row.original.color}/>
                                        </div>

                                    );
                                }

                            },
                            {
                                Header: '',
                                accessor: 'title',
                                Cell: (row: any) => {
                                    const id = 'annotation-title' + row.index;
                                    return (
                                        <div id={id}>

                                            <div>{row.original.text || 'no text'}</div>

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
                                    <DateTimeTableCell className="doc-col-last-updated" datetime={row.original.created}/>
                                )

                            },
                            {
                                id: 'tags',
                                Header: 'Tags',
                                accessor: '',
                                show: true,
                                width: 200,
                                Cell: (row: any) => {

                                    // TODO: use <FormattedTags>

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
                            id: "created",
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

                                const repoAnnotation = rowInfo.original as RepoAnnotation;
                                this.onSelected(rowInfo.viewIndex as number, repoAnnotation);

                            },

                            style: {
                                background: rowInfo && rowInfo.viewIndex === this.state.selected ? '#00afec' : 'white',
                                color: rowInfo && rowInfo.viewIndex === this.state.selected ? 'white' : 'black',
                            }

                        };
                    }}
                    getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {


                        const singleClickColumns: string[] = [];

                        if (! singleClickColumns.includes(column.id)) {
                            return {
                                onDoubleClick: (e: any) => {
                                    // this.onDocumentLoadRequested(rowInfo.original.fingerprint,
                                    // rowInfo.original.filename,
                                    // rowInfo.original.hashcode);
                                }
                            };
                        }

                        if (singleClickColumns.includes(column.id)) {

                            return {

                                onClick: ((e: any, handleOriginal?: () => void) => {
                                    //
                                    // this.handleToggleField(rowInfo.original,
                                    // column.id) .catch(err =>
                                    // log.error("Could not handle toggle: ",
                                    // err));

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

                </div>

            </div>

        );
    }

    public refresh() {
        const data = Object.values(this.props.repoDocMetaManager!.repoAnnotationIndex);
        this.doRefresh(this.filter(data));
    }

    private filter(data: RepoAnnotation[]): RepoAnnotation[] {
        return data;
    }

    private doRefresh(data: RepoAnnotation[]) {

        const state: IState = {...this.state, data};

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

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly onSelected: (repoAnnotation: RepoAnnotation) => void;

}

interface IState extends IReactTableState {

    data: RepoAnnotation[];

}

