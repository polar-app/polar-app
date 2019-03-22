import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {FilteredTags} from '../FilteredTags';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import AnnotationRepoTable from './AnnotationRepoTable';
import {Footer, Tips} from '../Utils';
import {RepoHeader} from '../repo_header/RepoHeader';
import {MessageBanner} from '../MessageBanner';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoAnnotationMetaView} from './RepoAnnotationMetaView';
import {SplitBar, SplitBarLeft, SplitBarRight} from '../SplitBar';
import {RepoSidebar} from '../RepoSidebar';
import {CloudAuthButton} from '../../../../web/js/ui/cloud_auth/CloudAuthButton';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {AddContentButton} from '../ui/AddContentButton';
import {TagButton} from '../doc_repo/TagButton';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {MultiDeleteButton} from '../doc_repo/multi_buttons/MultiDeleteButton';
import {NULL_FUNCTION} from '../../../../web/js/util/Functions';
import {DocRepoFilterBar} from '../doc_repo/DocRepoFilterBar';
import {DocRepoTableDropdown} from '../doc_repo/DocRepoTableDropdown';
import {AnnotationRepoFilterBar} from './AnnotationRepoFilterBar';
import {AddContentActions} from '../ui/AddContentActions';

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

            <FixedNav id="doc-repository" className="annotations-view">

                <header>
                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                    <div id="header-filter">

                        <div style={{display: 'flex'}}>

                            <div className=""
                                 style={{
                                     whiteSpace: 'nowrap',
                                     marginTop: 'auto',
                                     marginBottom: 'auto',
                                     display: 'flex'
                                 }}>

                                <AddContentButton importFromDisk={() => AddContentActions.cmdImportFromDisk()}
                                                  captureWebPage={() => AddContentActions.cmdCaptureWebPage()}/>

                            </div>

                            <div style={{marginLeft: 'auto'}}>

                                <AnnotationRepoFilterBar onToggleFlaggedOnly={value => NULL_FUNCTION}
                                                         onToggleFilterArchived={value => NULL_FUNCTION}
                                                         onFilterByTitle={(title) => NULL_FUNCTION}
                                                         tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                         refresher={() => NULL_FUNCTION}
                                                         filteredTags={new FilteredTags()}
                                                         right={
                                                             <div/>
                                                          }
                                />

                            </div>

                        </div>

                    </div>


                    <MessageBanner/>

                </header>

                <FixedNavBody>

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

                </FixedNavBody>

            </FixedNav>

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

