import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {RepoDocInfoLoader} from './RepoDocInfoLoader';
import {DocRepository} from './DocRepository';
import {FilteredTags} from './FilteredTags';
import {TableColumns} from './TableColumns';
import {IDocInfo} from '../../../web/js/metadata/DocInfo';
import {SyncBar, SyncBarProgress} from '../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher, SimpleReactor} from '../../../web/js/reactor/SimpleReactor';
import {DocRepoAnkiSyncController} from '../../../web/js/controller/DocRepoAnkiSyncController';
import {PrioritizedSplashes} from './splash/PrioritizedSplashes';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import DocRepoTable from './DocRepoTable';

const log = Logger.create();

export default class App extends React.Component<IProps, IState> {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly docRepository: DocRepository;

    private readonly repoDocInfoLoader: RepoDocInfoLoader;

    private readonly filteredTags = new FilteredTags();

    private readonly syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;
        this.docRepository = new DocRepository(this.persistenceLayerManager);
        this.repoDocInfoLoader = new RepoDocInfoLoader(this.persistenceLayerManager);

        new DocRepoAnkiSyncController(this.persistenceLayerManager, this.syncBarProgress)
            .start();

        this.state = {
            data: [],
            columns: new TableColumns()
        };

    }

    public render() {

        return (

            <div id="doc-repository">

                <PrioritizedSplashes/>

                <SyncBar progress={this.syncBarProgress}/>

                <DocRepoTable persistenceLayerManager={this.props.persistenceLayerManager}
                              updatedDocInfoEventDispatcher={this.props.updatedDocInfoEventDispatcher}/>

            </div>

        );
    }

}

export interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

}

export interface IState {

}
