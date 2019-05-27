import * as React from 'react';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import AnnotationRepoTable from './AnnotationRepoTable';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoAnnotationMetaView} from './RepoAnnotationMetaView';
import {AnnotationRepoFilterBar} from './AnnotationRepoFilterBar';
import {ChannelFunction} from '../../../../web/js/util/Channels';
import {AnnotationRepoFilters} from './AnnotationRepoFiltersHandler';
import {Dock} from '../../../../web/js/ui/dock/Dock';

export default class PreviewAndMainViewDock extends React.Component<IProps, IState> {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly docRepository: RepoDocMetaManager;

    private readonly repoDocInfoLoader: RepoDocMetaLoader;

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

            <Dock left={
                    // TODO: this should become its own component.
                    <div style={{display: 'flex' , flexDirection: 'column', height: '100%'}}>

                        <div className="mb-1 mt-1">

                            <AnnotationRepoFilterBar tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                     onFiltered={filters => this.props.filterChannel(filters)}
                                                     tagPopoverPlacement="auto"
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
                                                 // setFiltered={this.setFilterChannel}
                                                 data={this.props.data}
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

        );
    }

    private onRepoAnnotationSelected(repoAnnotation: RepoAnnotation) {
        // console.log("A repo annotation was selected: " , repoAnnotation);

        this.setState({repoAnnotation});

    }

}

export interface IProps {

    // FIXME: a lot of these could be cleaned up I think

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly syncBarProgress: IEventDispatcher<SyncBarProgress>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly filterChannel: ChannelFunction<AnnotationRepoFilters>;

    readonly data: ReadonlyArray<RepoAnnotation>;

}

export interface IState {

    readonly repoAnnotation?: RepoAnnotation;

}

