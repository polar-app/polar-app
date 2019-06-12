import * as React from 'react';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {FilteredTags} from '../FilteredTags';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import DocRepoTable from './DocRepoTable';

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
        };

    }

    public render() {

        return (

            <div id="doc-repository" style={{height: '100%'}}>

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

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

}

export interface IState {

}

