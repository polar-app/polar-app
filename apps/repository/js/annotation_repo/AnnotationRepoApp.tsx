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
import {RepoHeader} from '../repo_header/RepoHeader';
import {MessageBanner} from '../MessageBanner';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoAnnotationMetaView} from './RepoAnnotationMetaView';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {AddContentButton} from '../ui/AddContentButton';
import {AnnotationRepoFilterBar} from './AnnotationRepoFilterBar';
import {AddContentActions} from '../ui/AddContentActions';
import {CallbackFunction, Callbacks} from '../../../../web/js/util/Callbacks';
import {SetCallbackFunction} from '../../../../web/js/util/Callbacks';
import {AnnotationRepoFilters} from './AnnotationRepoFiltersHandler';

const log = Logger.create();

export default class AnnotationRepoApp extends React.Component<IProps, IState> {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly docRepository: RepoDocMetaManager;

    private readonly repoDocInfoLoader: RepoDocMetaLoader;

    private readonly filteredTags = new FilteredTags();

    private readonly filteredCallback: CallbackFunction<AnnotationRepoFilters>;

    private readonly setFilteredCallback: SetCallbackFunction<AnnotationRepoFilters>;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;
        this.docRepository = new RepoDocMetaManager(this.persistenceLayerManager);
        this.repoDocInfoLoader = new RepoDocMetaLoader(this.persistenceLayerManager);

        [this.filteredCallback, this.setFilteredCallback]
            = Callbacks.create<AnnotationRepoFilters>();

        this.state = {
        };

    }

    public render() {

        return (

            <FixedNav id="doc-repository" className="annotations-view">

                <header>
                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                    <div id="header-filter" className="mt-1">

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

                                <AnnotationRepoFilterBar tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                         onFiltered={filters => this.filteredCallback(filters)}
                                                         right={
                                                             <div/>
                                                          }
                                />

                            </div>

                        </div>

                    </div>

                    <MessageBanner/>

                </header>

                <div style={{display: 'flex'}}>

                    <div className="ml-1"
                         style={{width: 'calc(100% - 350px)'}}>

                        <FixedNavBody>

                            <AnnotationRepoTable persistenceLayerManager={this.props.persistenceLayerManager}
                                                 updatedDocInfoEventDispatcher={this.props.updatedDocInfoEventDispatcher}
                                                 repoDocMetaManager={this.props.repoDocMetaManager}
                                                 repoDocMetaLoader={this.props.repoDocMetaLoader}
                                                 setFilteredCallback={this.setFilteredCallback}
                                                 onSelected={repoAnnotation => this.onRepoAnnotationSelected(repoAnnotation)}/>

                        </FixedNavBody>

                    </div>

                    <div className="mt-2 pl-1 pr-1"
                         style={{width: '350px'}}>
                        <RepoAnnotationMetaView persistenceLayerManager={this.props.persistenceLayerManager}
                                                repoAnnotation={this.state.repoAnnotation}/>
                    </div>


                </div>

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

