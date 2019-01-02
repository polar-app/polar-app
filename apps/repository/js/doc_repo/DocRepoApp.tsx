import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {FilteredTags} from '../FilteredTags';
import {DocRepoTableColumns} from './DocRepoTableColumns';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import DocRepoTable from './DocRepoTable';

const log = Logger.create();

export default class DocRepoApp extends React.Component<IProps, IState> {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly repoDocInfoManager: RepoDocMetaManager;

    private readonly repoDocInfoLoader: RepoDocMetaLoader;

    private readonly filteredTags = new FilteredTags();

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;
        this.repoDocInfoManager = new RepoDocMetaManager(this.persistenceLayerManager);
        this.repoDocInfoLoader = new RepoDocMetaLoader(this.persistenceLayerManager);

        this.state = {
            data: [],
            columns: new DocRepoTableColumns()
        };

    }

    public render() {

        return (

            <div id="doc-repository">

                <DocRepoTable persistenceLayerManager={this.props.persistenceLayerManager}
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
