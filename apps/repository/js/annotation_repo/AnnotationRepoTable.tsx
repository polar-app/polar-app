import * as React from 'react';
import ReactTable from "react-table";
import {Footer, Tips} from '../Utils';
import {Logger} from '../../../../web/js/logger/Logger';
import {DocLoader} from '../../../../web/js/apps/main/ipc/DocLoader';
import {Strings} from '../../../../web/js/util/Strings';
import {RepoDocInfoLoader} from '../RepoDocInfoLoader';
import {AppState} from '../AppState';
import {RepoDocInfo} from '../RepoDocInfo';
import {RepoDocInfos} from '../RepoDocInfos';
import {RepoDocInfoManager} from '../RepoDocInfoManager';
import {TagInput} from '../TagInput';
import {Optional} from '../../../../web/js/util/ts/Optional';
import {Tag} from '../../../../web/js/tags/Tag';
import {FilterTagInput} from '../FilterTagInput';
import {FilteredTags} from '../FilteredTags';
import {isPresent} from '../../../../web/js/Preconditions';
import {Sets} from '../../../../web/js/util/Sets';
import {Tags} from '../../../../web/js/tags/Tags';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {MessageBanner} from '../MessageBanner';
import {DocDropdown} from '../DocDropdown';
import {TableDropdown} from '../TableDropdown';
import {TableColumns} from '../TableColumns';
import {SettingsStore} from '../../../../web/js/datastore/SettingsStore';
import {Version} from '../../../../web/js/util/Version';
import {RepoDocInfoIndex} from '../RepoDocInfoIndex';
import {AutoUpdatesController} from '../../../../web/js/auto_updates/AutoUpdatesController';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher, SimpleReactor} from '../../../../web/js/reactor/SimpleReactor';
import {DocRepoAnkiSyncController} from '../../../../web/js/controller/DocRepoAnkiSyncController';
import {CloudAuthButton} from '../../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerManager, PersistenceLayerTypes} from '../../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayerEvent} from '../../../../web/js/datastore/PersistenceLayerEvent';
import {CloudService} from '../cloud/CloudService';
import {Throttler} from '../../../../web/js/datastore/Throttler';
import {PersistenceLayer} from '../../../../web/js/datastore/PersistenceLayer';
import {Backend} from '../../../../web/js/datastore/Backend';
import {Hashcode} from '../../../../web/js/metadata/Hashcode';
import {FileRef} from '../../../../web/js/datastore/Datastore';
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

        this.init()
            .catch(err => log.error("Could not init: ", err));

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
                                    this.onDocumentLoadRequested(rowInfo.original.fingerprint,
                                                                 rowInfo.original.filename,
                                                                 rowInfo.original.hashcode);
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

    private onDocumentLoadRequested(fingerprint: string,
                                    filename: string,
                                    hashcode?: Hashcode) {

        const handler = async () => {

            const persistenceLayer = this.persistenceLayerManager.get();

            const ref: FileRef = {
                name: filename,
                hashcode
            };

            // NOTE: these operations execute locally first, so it's a quick
            // way to verify that the file needs to be synchronized.
            const requiresSynchronize =
                ! await persistenceLayer.contains(fingerprint) ||
                ! await persistenceLayer.containsFile(Backend.STASH, ref);

            if (requiresSynchronize) {
                await persistenceLayer.synchronizeDocs(fingerprint);
                log.notice("Forcing synchronization (doc not local): " + fingerprint);
            }

            await DocLoader.load({
                fingerprint,
                filename,
                newWindow: true
            });

        };

        handler()
            .catch(err => log.error("Unable to load doc: ", err));

    }

    private async init(): Promise<void> {

        // noop

    }

    private emitInitAnalytics(repoDocs: RepoDocInfoIndex) {

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

