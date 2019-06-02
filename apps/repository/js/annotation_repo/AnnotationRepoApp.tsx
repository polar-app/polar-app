import * as React from 'react';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoHeader} from '../repo_header/RepoHeader';
import {MessageBanner} from '../MessageBanner';
import {RepoAnnotation} from '../RepoAnnotation';
import {FixedNav} from '../FixedNav';
import PreviewAndMainViewDock from './PreviewAndMainViewDock';
import {Dock} from '../../../../web/js/ui/dock/Dock';
import {TagTree} from '../../../../web/js/ui/tree/TagTree';
import {NULL_FUNCTION} from '../../../../web/js/util/Functions';
import {UpdatedCallback} from './AnnotationRepoFilterEngine';
import {AnnotationRepoFilterEngine} from './AnnotationRepoFilterEngine';
import {PersistenceLayerManagers} from '../../../../web/js/datastore/PersistenceLayerManagers';
import {RepoDocMetaLoaders} from '../RepoDocMetaLoaders';
import {Channels} from '../../../../web/js/util/Channels';
import {AnnotationRepoFilters} from './AnnotationRepoFiltersHandler';
import {ChannelFunction} from '../../../../web/js/util/Channels';
import {ChannelCoupler} from '../../../../web/js/util/Channels';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {TagDescriptor} from '../../../../web/js/tags/TagNode';
import {TagStr} from '../../../../web/js/tags/Tag';
import {TreeState} from '../../../../web/js/ui/tree/TreeView';

export default class AnnotationRepoApp extends ReleasingReactComponent<IProps, IState> {

    private readonly filterChannel: ChannelFunction<AnnotationRepoFilters>;

    private readonly setFilterChannel: ChannelCoupler<AnnotationRepoFilters>;

    private readonly treeState: TreeState<TagStr>;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onSelected = this.onSelected.bind(this);

        [this.filterChannel, this.setFilterChannel]
            = Channels.create<AnnotationRepoFilters>();

        this.state = {
            data: [],
            tags: [],
            selected: []
        };

        this.init();

        this.treeState = new TreeState(values => this.onSelected(...values));

    }
    public init() {

        // FIXME: this code need to be move to the parent so that it can
        //  setState every time the entire app reloads

        const setStateInBackground = (state: IState) => {

            setTimeout(() => {

                // The react table will not update when I change the state from
                // within the event listener
                this.setState(state);

            }, 1);

        };

        const onUpdated: UpdatedCallback = repoAnnotations => {

            const tags = this.props.repoDocMetaManager.tagsDB.tags()
                .map(current => {
                    // FIXME: this count is a FAKE value... it is just something
                    // we're pulling out of the air until we compute the actual
                    // count of objects for this tag.  This is a big TODO that
                    // I need need to fix before we merge.
                    const count = Math.floor(Math.random() * 100);
                    return {...current, count};
                });

            console.log("FIXME: selected is now: ", JSON.stringify(this.state.selected));

            const state = {...this.state, data: repoAnnotations, tags};

            console.log("FIXME: selected will become: ", JSON.stringify(state.selected));

            setStateInBackground(state);

        };

        const repoAnnotationsProvider =
            () => Object.values(this.props.repoDocMetaManager!.repoAnnotationIndex);

        const filterEngine = new AnnotationRepoFilterEngine(repoAnnotationsProvider, onUpdated);

        // this will trigger the filter engine to be run which will then call
        // onUpdated which then calls setState
        this.setFilterChannel(filters => filterEngine.onFiltered(filters));

        const doRefresh = () => filterEngine.onProviderUpdated();

        PersistenceLayerManagers.onPersistenceManager(this.props.persistenceLayerManager, (persistenceLayer) => {

            this.releaser.register(
                persistenceLayer.addEventListener(() => doRefresh()));

        });

        this.releaser.register(
            RepoDocMetaLoaders.addThrottlingEventListener(this.props.repoDocMetaLoader, () => doRefresh()));

        // do an initial refresh to get the first batch of data.
        doRefresh();

    }

    public render() {

        return (

            <FixedNav id="doc-repository"
                      className="annotations-view">

                <header>
                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                    <MessageBanner/>

                </header>

                <Dock left={
                    // TODO this should be its own component
                    <div style={{display: 'flex' ,
                                 flexDirection: 'column',
                                 height: '100%',
                                 overflow: 'auto'}}>

                        <div className="m-1">
                            <TagTree tags={this.state.tags}
                                     treeState={this.treeState}
                                     selected={this.state.selected}
                                     onSelected={values => this.onSelected(values)}
                                     noCreate={true}/>
                        </div>

                    </div>
                  }
                  right={
                      <PreviewAndMainViewDock  data={this.state.data} filterChannel={this.filterChannel} {...this.props}/>
                  }
                  side='left'
                  initialWidth={300}/>


            </FixedNav>

        );
    }

    private onSelected(...selected: ReadonlyArray<TagStr>) {
        this.setState({...this.state, selected});

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

    readonly data: ReadonlyArray<RepoAnnotation>;

    /**
     * All available tags
     */
    readonly tags: ReadonlyArray<TagDescriptor>;

    /**
     * The currently selected tags.
     */
    readonly selected: ReadonlyArray<TagStr>;

}

