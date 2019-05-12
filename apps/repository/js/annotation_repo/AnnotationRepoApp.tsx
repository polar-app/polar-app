import * as React from 'react';
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
import {FixedNav} from '../FixedNav';
import {AnnotationRepoFilterBar} from './AnnotationRepoFilterBar';
import {ChannelFunction, Channels} from '../../../../web/js/util/Channels';
import {ChannelCoupler} from '../../../../web/js/util/Channels';
import {AnnotationRepoFilters} from './AnnotationRepoFiltersHandler';
import {Dock} from '../../../../web/js/ui/dock/Dock';

export default class AnnotationRepoApp extends React.Component<IProps, IState> {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly docRepository: RepoDocMetaManager;

    private readonly repoDocInfoLoader: RepoDocMetaLoader;

    private readonly filteredTags = new FilteredTags();

    private readonly filterChannel: ChannelFunction<AnnotationRepoFilters>;

    private readonly setFilterChannel: ChannelCoupler<AnnotationRepoFilters>;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;
        this.docRepository = new RepoDocMetaManager(this.persistenceLayerManager);
        this.repoDocInfoLoader = new RepoDocMetaLoader(this.persistenceLayerManager);

        [this.filterChannel, this.setFilterChannel]
            = Channels.create<AnnotationRepoFilters>();

        this.state = {
        };

    }

    public render() {

        return (

            <FixedNav id="doc-repository"
                      className="annotations-view">

                <header>
                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                    {/*<div id="header-filter" className="mt-1">*/}

                    {/*    <div style={{display: 'flex'}}>*/}

                    {/*        <div className=""*/}
                    {/*             style={{*/}
                    {/*                 whiteSpace: 'nowrap',*/}
                    {/*                 marginTop: 'auto',*/}
                    {/*                 marginBottom: 'auto',*/}
                    {/*                 display: 'flex'*/}
                    {/*             }}>*/}

                    {/*            <AddContentButton importFromDisk={() => AddContentActions.cmdImportFromDisk()}*/}
                    {/*                              captureWebPage={() => AddContentActions.cmdCaptureWebPage()}/>*/}

                    {/*        </div>*/}

                    {/*        <div style={{marginLeft: 'auto'}}>*/}

                    {/*        </div>*/}

                    {/*    </div>*/}

                    {/*</div>*/}

                    <MessageBanner/>

                </header>

                <Dock left={
                        <div style={{display: 'flex' , flexDirection: 'column', height: '100%'}}>

                            <div className="mb-1 mt-1">

                                <AnnotationRepoFilterBar tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                         onFiltered={filters => this.filterChannel(filters)}
                                                         tagPopoverPlacement="bottom-end"
                                                         right={
                                                             <div/>
                                                         }
                                />

                            </div>

                            <div style={{flexGrow: 1, overflowY: 'auto'}}>

                                <AnnotationRepoTable persistenceLayerManager={this.props.persistenceLayerManager}
                                                     updatedDocInfoEventDispatcher={this.props.updatedDocInfoEventDispatcher}
                                                     repoDocMetaManager={this.props.repoDocMetaManager}
                                                     repoDocMetaLoader={this.props.repoDocMetaLoader}
                                                     setFiltered={this.setFilterChannel}
                                                     onSelected={repoAnnotation => this.onRepoAnnotationSelected(repoAnnotation)}/>

                            </div>

                        </div>
                      }
                      right={
                          <div className="mt-2 pl-1 pr-1"
                               style={{}}>
                              <RepoAnnotationMetaView persistenceLayerManager={this.props.persistenceLayerManager}
                                                      repoAnnotation={this.state.repoAnnotation}/>
                          </div>
                      }
                      side='left'
                      initialWidth={450}/>

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

