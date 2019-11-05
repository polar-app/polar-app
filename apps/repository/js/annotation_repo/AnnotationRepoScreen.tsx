import * as React from 'react';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
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
import {AnnotationRepoFilterEngine, UpdatedCallback} from './AnnotationRepoFilterEngine';
import {PersistenceLayerManagers} from '../../../../web/js/datastore/PersistenceLayerManagers';
import {RepoDocMetaLoaders} from '../RepoDocMetaLoaders';
import {AnnotationRepoFiltersHandler} from './AnnotationRepoFiltersHandler';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {TagDescriptor} from '../../../../web/js/tags/TagNode';
import {Tag, TagStr} from 'polar-shared/src/tags/Tags';
import {Tags} from 'polar-shared/src/tags/Tags';
import {FilteredTags} from '../FilteredTags';
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {Row} from "../../../../web/js/ui/layout/Row";
import {StartReviewButton} from "./filter_bar/StartReviewButton";
import {Reviewers} from "../reviewer/Reviewers";
import {TextFilter} from "./filter_bar/TextFilter";
import {HighlightColorFilterButton} from "./filter_bar/HighlightColorFilterButton";
import {AnnotationTypeSelector} from "./filter_bar/controls/AnnotationTypeSelector";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";

export default class AnnotationRepoScreen extends ReleasingReactComponent<IProps, IState> {

    private readonly treeState: TreeState<TagDescriptor>;

    private readonly filtersHandler: AnnotationRepoFiltersHandler;

    /**
     * The tags that are selected by the user.
     */
    private selectedTags: ReadonlyArray<Tag> = [];

    /**
     * The tags that are selected by the user.
     */
    private selectedFolders: ReadonlyArray<Tag> = [];

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onSelectedFolders = this.onSelectedFolders.bind(this);
        this.onUpdatedTags = this.onUpdatedTags.bind(this);
        this.startReview = this.startReview.bind(this);

        this.state = {
            data: [],
            tags: [],
        };

        const onSelected = (values: ReadonlyArray<TagStr>) => this.onSelectedFolders(values);

        this.treeState = new TreeState(onSelected);

        const setStateInBackground = (state: IState) => {

            setTimeout(() => {

                // The react table will not update when I change the state from
                // within the event listener
                this.setState(state);

            }, 1);

        };

        const onUpdated: UpdatedCallback = repoAnnotations => {

            const tags = this.props.repoDocMetaManager.repoAnnotationIndex.toTagDescriptors();

            const state = {...this.state, data: repoAnnotations, tags};

            setStateInBackground(state);

        };

        const repoAnnotationsProvider: () => ReadonlyArray<RepoAnnotation> =
            () => this.props.repoDocMetaManager!.repoAnnotationIndex.values();

        const filterEngine = new AnnotationRepoFilterEngine(repoAnnotationsProvider, onUpdated);

        this.filtersHandler = new AnnotationRepoFiltersHandler(filters => filterEngine.onFiltered(filters));

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

                    <Row id="header-filter"
                         className="border-bottom p-1">
                        <Row.Main>
                            <StartReviewButton onClick={() => this.startReview()}/>
                        </Row.Main>

                        <Row.Right>

                            <div style={{display: 'flex'}}>

                                <div className="mr-1">
                                    <AnnotationTypeSelector selected={this.filtersHandler.filters.annotationTypes || []}
                                                            onSelected={selected => this.filtersHandler.update({annotationTypes: selected})}/>
                                </div>

                                <div className="mr-1">
                                    <HighlightColorFilterButton selectedColors={this.filtersHandler.filters.color ? [this.filtersHandler.filters.color] : undefined}
                                                                onSelected={color => this.filtersHandler.update({color})}/>
                                </div>

                                <div className="d-none-mobile">
                                    <TextFilter updateFilters={filters => this.filtersHandler.update(filters)}/>
                                </div>

                            </div>

                        </Row.Right>

                    </Row>

                    <MessageBanner/>

                </header>

                <Dock componentClassNames={{
                        left: 'd-none-mobile',
                        splitter: 'd-none-mobile'
                      }}
                      left={
                          // TODO this should be its own component
                          <div style={{
                              display: 'flex' ,
                              flexDirection: 'column',
                              height: '100%',
                              overflow: 'auto',
                          }}>

                            <div className="m-1">

                                <TagTree tags={this.state.tags}
                                         treeState={this.treeState}
                                         rootTitle="Folders"
                                         tagType='folder'
                                         noCreate={true}/>

                                <TagTree tags={this.state.tags}
                                         treeState={this.treeState}
                                         rootTitle="Tags"
                                         tagType='regular'
                                         filterDisabled={true}
                                         noCreate={true}/>

                            </div>

                        </div>
                      }
                      right={
                          <PreviewAndMainViewDock data={this.state.data}
                                                  updateFilters={filters => this.filtersHandler.update(filters)}
                                                  {...this.props}/>
                      }
                      side='left'
                      initialWidth={300}/>

            </FixedNav>

        );
    }

    private onSelectedFolders(selected: ReadonlyArray<TagStr>) {
        this.selectedFolders = selected.map(current => Tags.create(current));
        this.onUpdatedTags();
    }

    private onUpdatedTags() {

        const tags = [...this.selectedTags, ...this.selectedFolders];

        const filteredTags = new FilteredTags();
        filteredTags.set(tags);

        this.filtersHandler.update({filteredTags});
    }

    private startReview() {
        const persistenceLayer = this.props.persistenceLayerManager.get();
        const datastoreCapabilities = persistenceLayer.capabilities();
        const prefs = persistenceLayer.datastore.getPrefs();

        Reviewers.start(datastoreCapabilities, prefs.get().prefs, this.state.data, 10);
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
    // readonly selected: ReadonlyArray<TagStr>;

}

