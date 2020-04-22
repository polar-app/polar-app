import * as React from 'react';
import {RepoDocMetaLoader, RepoDocMetaUpdater} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoHeader} from '../repo_header/RepoHeader';
import {FixedNav} from '../FixedNav';
import {AnnotationRepoFilterEngine, UpdatedCallback} from './AnnotationRepoFilterEngine';
import {PersistenceLayerManagers} from '../../../../web/js/datastore/PersistenceLayerManagers';
import {RepoDocMetaLoaders} from '../RepoDocMetaLoaders';
import {AnnotationRepoFiltersHandler} from './AnnotationRepoFiltersHandler';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {Tag, Tags, TagStr} from 'polar-shared/src/tags/Tags';
import {FilteredTags} from '../FilteredTags';
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {Row} from "../../../../web/js/ui/layout/Row";
import {DEFAULT_LIMIT, Reviewers} from "../reviewer/Reviewers";
import {TextFilter} from "./filter_bar/TextFilter";
import {HighlightColorFilterButton} from "./filter_bar/controls/color/HighlightColorFilterButton";
import {AnnotationTypeSelector} from "./filter_bar/controls/annotation_type/AnnotationTypeSelector";
import {StartReviewDropdown} from "./filter_bar/StartReviewDropdown";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {RepoFooter} from "../repo_footer/RepoFooter";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationRepoTableDropdown} from "./AnnotationRepoTableDropdown";
import {FolderSidebar, FoldersSidebarProps} from "../folders/FolderSidebar";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {PersistenceLayerMutator} from "../persistence_layer/PersistenceLayerMutator";
import {Link, Route, Switch} from "react-router-dom";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {FloatingActionButton} from "../../../../web/js/ui/mobile/FloatingActionButton";
import {StartReviewBottomSheet} from "../../../../web/js/ui/mobile/StartReviewBottomSheet";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";
import {AnnotationListView} from "./AnnotationListView";
import {AnnotationPreviewView} from "./AnnotationPreviewView";
import {IndeterminateLoadingModal} from "../../../../web/js/ui/mobile/IndeterminateLoadingModal";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {LeftSidebar} from "../../../../web/js/ui/motion/LeftSidebar";
import {Button} from "reactstrap";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import Paper from "@material-ui/core/Paper";

interface AnnotationsListProps extends IProps, IState {
    readonly filtersHandler: AnnotationRepoFiltersHandler;
    readonly onSelected: (repoAnnotation: IDocAnnotation) => void;
}

const AnnotationsList = (props: AnnotationsListProps) => (
    <AnnotationListView updateFilters={filters => props.filtersHandler.update(filters)}
                        onSelected={repoAnnotation => props.onSelected(repoAnnotation)}
                        {...props} />
);

interface AnnotationsPreviewProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly repoDocMetaUpdater: RepoDocMetaUpdater;
    readonly repoAnnotation: IDocAnnotation | undefined;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
}

const AnnotationPreview = (props: AnnotationsPreviewProps) => (
    <AnnotationPreviewView persistenceLayerManager={props.persistenceLayerManager}
                           repoDocMetaUpdater={props.repoDocMetaUpdater}
                           tagsProvider={props.tagsProvider}
                           repoAnnotation={props.repoAnnotation}/>
);

interface RouterProps extends main.MainProps {
    readonly onCreateReviewer: (mode: RepetitionMode) => any;
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

const onClose = () => window.history.back();

const Router = (props: RouterProps) => (

    <Switch location={ReactRouters.createLocationWithHashOnly()}>

        <Route path='#folders'
               render={() => (
                   <LeftSidebar onClose={onClose}>
                       <main.Folders {...props}/>
                   </LeftSidebar>
               )}/>

        <Route path='#start-review'
               render={() => <StartReviewBottomSheet onReading={NULL_FUNCTION} onFlashcards={NULL_FUNCTION}/>}/>

        <Route path='#review-flashcards'
               component={() => <IndeterminateLoadingModal id="loading-flashcards"
                                                           provider={() => props.onCreateReviewer('flashcard')}/>}/>

        <Route path='#review-reading'
               component={() => <IndeterminateLoadingModal id="loading-review"
                                                           provider={() => props.onCreateReviewer('reading')}/>}/>

    </Switch>

);

namespace main {

    export interface MainProps extends IProps, IState {
        readonly filtersHandler: AnnotationRepoFiltersHandler;
        readonly onSelected: (repoAnnotation: IDocAnnotation) => void;
        readonly persistenceLayerMutator: PersistenceLayerMutator;
        readonly treeState: TreeState<TagDescriptor>;
        readonly tagsProvider: () => ReadonlyArray<Tag>;
    }

    export interface FoldersProps extends FoldersSidebarProps {

    }

    export const Folders = (props: MainProps) => (
        <FolderSidebar tags={props.tags()}
                       persistenceLayerMutator={props.persistenceLayerMutator}
                       treeState={props.treeState}/>
    );

    export const Phone = (props: MainProps) => (
        <DockLayout dockPanels={[
            {
                id: 'dock-panel-center',
                type: 'grow',
                component: <AnnotationsList {...props}/>,
            },
        ]}/>
    );

    export const Tablet = (props: MainProps) => (
        <DockLayout dockPanels={[
            {
                id: 'dock-panel-center',
                type: 'fixed',
                component: <AnnotationsList {...props}/>,
                width: 350
            },
            {
                id: 'dock-panel-right',
                type: 'grow',
                component: <AnnotationPreview repoDocMetaUpdater={props.repoDocMetaLoader}
                                              repoAnnotation={props.repoAnnotation || undefined}
                                              {...props}/>
            }
        ]}/>
    );

    export const Desktop = (props: MainProps) => (
        <DockLayout dockPanels={[
            {
                id: 'dock-panel-left',
                type: 'fixed',
                component: <main.Folders {...props}/>,
                width: 300
            },
            {
                id: 'dock-panel-center',
                type: 'fixed',
                style: {
                    display: 'flex'
                },
                component:
                    <Paper square style={{flexGrow: 1}}>
                        <AnnotationListView data={props.data}
                                            updateFilters={filters => props.filtersHandler.update(filters)}
                                            onSelected={repoAnnotation => props.onSelected(repoAnnotation)}
                                            {...props}/>
                    </Paper>,
                width: 450
            },
            {
                id: 'dock-panel-right',
                type: 'grow',
                style: {
                    display: 'flex'
                },
                component:
                    <Paper square style={{flexGrow: 1}}>
                        <AnnotationPreviewView persistenceLayerManager={props.persistenceLayerManager}
                                                      repoDocMetaUpdater={props.repoDocMetaLoader}
                                                      tagsProvider={props.tagsProvider}
                                                      repoAnnotation={props.repoAnnotation}/>
                    </Paper>

            }
        ]}/>
    );

}

namespace screen {

    interface PhoneAndTabletProps extends ScreenProps {

    }

    const FilterBar = (props: PhoneAndTabletProps) => (
        <div style={{display: 'flex'}}>
            <div className="mr-1 mt-auto mb-auto">
                <AnnotationTypeSelector
                    selected={props.filtersHandler.filters.annotationTypes || []}
                    onSelected={annotationTypes => props.filtersHandler.update({annotationTypes})}/>
            </div>

            <div className="mr-1 mt-auto mb-auto">
                <HighlightColorFilterButton selected={props.filtersHandler.filters.colors}
                                            onSelected={selected => props.filtersHandler.update({colors: selected})}/>
            </div>

            <div className="ml-1 d-none-mobile mt-auto mb-auto">
                <TextFilter updateFilters={filters => props.filtersHandler.update(filters)}/>
            </div>

            <div className="ml-1 d-none-mobile mt-auto mb-auto">
                <AnnotationRepoTableDropdown persistenceLayerProvider={() => props.persistenceLayerManager.get()}
                                             annotations={props.data}/>
            </div>
        </div>
    );

    export const PhoneAndTablet = (props: PhoneAndTabletProps) => {

        return (

            <FixedNav id="doc-repository"
                      className="annotations-view">

                <FixedNav.Header>

                    <RepoHeader right={<FilterBar {...props}/>}
                                toggle={(
                                    <Link to="#folders">
                                        <Button color="clear">
                                            <i className="fas fa-bars"/>
                                        </Button>
                                    </Link>
                                )}
                                persistenceLayerProvider={props.persistenceLayerProvider}
                                persistenceLayerController={props.persistenceLayerManager}/>

                </FixedNav.Header>

                <FixedNav.Body>

                    <Router onCreateReviewer={mode => props.onCreateReviewer(mode)}
                            persistenceLayerProvider={props.persistenceLayerProvider}
                            {...props}/>

                    <Link to={{pathname: '/annotations', hash: '#start-review'}}>

                        <FloatingActionButton style={{
                                                  marginBottom: '60px',
                                                  marginRight: '20px'
                                              }}
                                              icon="fas fa-graduation-cap"/>

                    </Link>

                    <DeviceRouter phone={<main.Phone {...props}/>}
                                  tablet={<main.Tablet {...props}/>}>

                    </DeviceRouter>

                </FixedNav.Body>

                <FixedNav.Footer>
                    <RepoFooter/>
                </FixedNav.Footer>

            </FixedNav>

        );
    };

    export interface ScreenProps extends IProps, IState {
        readonly filtersHandler: AnnotationRepoFiltersHandler;
        readonly persistenceLayerMutator: PersistenceLayerMutator;
        readonly treeState: TreeState<TagDescriptor>;
        readonly onSelected: (repoAnnotation: IDocAnnotation) => void;
        readonly onStartReview: (mode: RepetitionMode) => void;
        readonly onCreateReviewer: (mode: RepetitionMode) => any;
        readonly tagsProvider: () => ReadonlyArray<Tag>;
    }

    export const Desktop = (props: ScreenProps) => (

        <FixedNav id="doc-repository"
                  className="annotations-view">

            <header>

                <RepoHeader persistenceLayerProvider={props.persistenceLayerProvider}
                            persistenceLayerController={props.persistenceLayerManager}/>

                <Row id="header-filter"
                     className="border-bottom p-1">
                    <Row.Main>
                        {/*<StartReviewButton onClick={() => this.startReview('flashcard')}/>*/}
                        <StartReviewDropdown onFlashcards={() => props.onStartReview('flashcard')}
                                             onReading={() => props.onStartReview('reading')}/>
                    </Row.Main>

                    <Row.Right>

                        <FilterBar {...props}/>

                    </Row.Right>

                </Row>

            </header>

            <Router onCreateReviewer={mode => props.onCreateReviewer(mode)}
                    persistenceLayerProvider={props.persistenceLayerProvider}
                    {...props}/>

            <main.Desktop {...props}/>

            <RepoFooter/>

        </FixedNav>

    );

}

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

    private persistenceLayerMutator: PersistenceLayerMutator;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onSelectedFolders = this.onSelectedFolders.bind(this);
        this.onUpdatedTags = this.onUpdatedTags.bind(this);
        this.startReview = this.startReview.bind(this);
        this.createReviewer = this.createReviewer.bind(this);
        this.setStateInBackground = this.setStateInBackground.bind(this);

        this.state = {
            data: [],
        };

        const onSelected = (values: ReadonlyArray<TagStr>) => this.onSelectedFolders(values);

        this.treeState = new TreeState(onSelected);

        const onUpdated: UpdatedCallback<IDocAnnotation> = (repoAnnotations: ReadonlyArray<IDocAnnotation>) => {

            const state = {...this.state, data: repoAnnotations};
            this.setStateInBackground(state);

        };

        const repoAnnotationsProvider: () => ReadonlyArray<IDocAnnotation> =
            () => this.props.repoDocMetaManager!.repoDocAnnotationIndex.values();

        const filterEngine = new AnnotationRepoFilterEngine(repoAnnotationsProvider, onUpdated);

        this.filtersHandler = new AnnotationRepoFiltersHandler(filters => filterEngine.onFiltered(filters));

        const doRefresh = () => filterEngine.onProviderUpdated();

        const repoDocInfosProvider = () => this.props.repoDocMetaManager.repoDocInfoIndex.values();

        this.persistenceLayerMutator
            = new PersistenceLayerMutator(this.props.repoDocMetaManager,
                                          this.props.persistenceLayerProvider,
                                          this.props.tags,
                                          repoDocInfosProvider,
                                          () => doRefresh());

        PersistenceLayerManagers.onPersistenceManager(this.props.persistenceLayerManager, (persistenceLayer) => {

            this.releaser.register(
                persistenceLayer.addEventListener((event) => {
                    doRefresh();
                }));

        });

        this.releaser.register(
            RepoDocMetaLoaders.addThrottlingEventListener(this.props.repoDocMetaLoader, () => {
                doRefresh();
            }));

        // do an initial refresh to get the first batch of data.
        doRefresh();

    }

    public render() {

        const props: screen.ScreenProps = {
            ...this.props,
            ...this.state,
            persistenceLayerMutator: this.persistenceLayerMutator,
            treeState: this.treeState,
            filtersHandler: this.filtersHandler,
            tagsProvider: this.props.tags,
            onSelected: (repoAnnotation) => this.setStateInBackground({...this.state, repoAnnotation}),
            onStartReview: (mode) => this.startReview(mode),
            onCreateReviewer: (mode) => this.createReviewer(mode)

        };

        return <DeviceRouter desktop={<screen.Desktop {...props}/>}
                             phone={<screen.PhoneAndTablet {...props}/>}
                             tablet={<screen.PhoneAndTablet {...props}/>}/>;

    }

    private setStateInBackground(state: IState) {

        const getExistingRepoAnnotation = (repoAnnotation: IDocAnnotation | undefined): IDocAnnotation | undefined => {

            const repoDocAnnotationIndex = this.props.repoDocMetaManager.repoDocAnnotationIndex;

            if (! repoAnnotation) {
                return undefined;
            }

            const existing = repoDocAnnotationIndex.get(repoAnnotation.id);

            if (existing) {
                return existing;
            }

            // TODO: get via GUID. this isn't efficient and is O(N) but it's
            // not very many comparisons.
            const values = repoDocAnnotationIndex.values();

            return arrayStream(values)
                .filter(current => repoAnnotation.guid === current.guid)
                .first();

        };

        setTimeout(() => {

            // check if we still have the repoAnnotation in case it's deleted
            const repoAnnotation = getExistingRepoAnnotation(state.repoAnnotation);

            state = {
                ...state,
                repoAnnotation
            };

            // The react table will not update when I change the state from
            // within the event listener
            this.setState(state);

        }, 1);

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

    private startReview(mode: RepetitionMode = 'reading') {
        const persistenceLayer = this.props.persistenceLayerManager.get();
        const datastoreCapabilities = persistenceLayer.capabilities();
        const prefs = persistenceLayer.datastore.getPrefs();

        Reviewers.start(datastoreCapabilities, prefs.get(), this.state.data, mode, 10);
    }

    private async createReviewer(mode: RepetitionMode = 'reading') {
        const persistenceLayer = this.props.persistenceLayerManager.get();
        const datastoreCapabilities = persistenceLayer.capabilities();
        const prefs = persistenceLayer.datastore.getPrefs();

        return await Reviewers.create(datastoreCapabilities, prefs.get(), this.state.data, mode, NULL_FUNCTION, DEFAULT_LIMIT);
    }

}

export interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly persistenceLayerProvider: PersistenceLayerProvider;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly syncBarProgress: IEventDispatcher<SyncBarProgress>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly tags: () => ReadonlyArray<TagDescriptor>;

}

export interface IState {

    readonly repoAnnotation?: IDocAnnotation;

    readonly data: ReadonlyArray<IDocAnnotation>;

}


