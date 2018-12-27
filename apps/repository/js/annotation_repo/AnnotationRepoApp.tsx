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
import {Footer, Tips} from '../Utils';
import {RepoHeader} from '../RepoHeader';
import {MessageBanner} from '../MessageBanner';
import SplitterLayout from 'react-splitter-layout';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoAnnotationMetaView} from './RepoAnnotationMetaView';

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
        };

    }

    public render() {

        return (

            <div id="doc-repository">

                <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                <MessageBanner/>

                <div style={{display: 'flex'}}>

                    <div style={{width: 'calc(100% - 350px)'}}>

                        <AnnotationRepoTable persistenceLayerManager={this.props.persistenceLayerManager}
                                             updatedDocInfoEventDispatcher={this.props.updatedDocInfoEventDispatcher}
                                             repoDocMetaManager={this.props.repoDocMetaManager}
                                             repoDocMetaLoader={this.props.repoDocMetaLoader}
                                             onSelected={repoAnnotation => this.onRepoAnnotationSelected(repoAnnotation)}/>

                    </div>

                    <div className="mt-2" style={{width: '350px'}}>
                        <RepoAnnotationMetaView persistenceLayerManager={this.props.persistenceLayerManager}
                                                repoAnnotation={this.state.repoAnnotation}/>
                    </div>


                </div>

                <br />
                <Tips />
                <Footer/>

            </div>

        );
    }

    private onRepoAnnotationSelected(repoAnnotation: RepoAnnotation) {
        // console.log("A repo annotation was selected: " , repoAnnotation);

        this.setState({repoAnnotation});

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

    readonly repoAnnotation?: RepoAnnotation;

}
