import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {FilteredTags} from '../FilteredTags';
import {TableColumns} from '../TableColumns';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBar, SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher, SimpleReactor} from '../../../../web/js/reactor/SimpleReactor';
import {DocRepoAnkiSyncController} from '../../../../web/js/controller/DocRepoAnkiSyncController';
import {PrioritizedSplashes} from '../splash/PrioritizedSplashes';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import DocRepoTable from '../doc_repo/DocRepoTable';
import AnnotationRepoTable from './AnnotationRepoTable';

const log = Logger.create();

export default class AnnotationRepoApp extends React.Component<IProps, IState> {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly docRepository: RepoDocMetaManager;

    private readonly repoDocInfoLoader: RepoDocMetaLoader;

    private readonly filteredTags = new FilteredTags();

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;
        this.docRepository = new RepoDocMetaManager(this.persistenceLayerManager);
        this.repoDocInfoLoader = new RepoDocMetaLoader(this.persistenceLayerManager);

        this.state = {
            data: [],
            columns: new TableColumns()
        };

    }

    public render() {

        return (

            <div id="doc-repository">

                <AnnotationRepoTable persistenceLayerManager={this.props.persistenceLayerManager}
                                     updatedDocInfoEventDispatcher={this.props.updatedDocInfoEventDispatcher}
                                     repoDocMetaManager={this.props.repoDocMetaManager}
                                     repoDocMetaLoader={this.props.repoDocMetaLoader}/>

            </div>

        );
    }

}

export interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly syncBarProgress: IEventDispatcher<SyncBarProgress>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;
}

export interface IState {

}
