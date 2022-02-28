import * as React from 'react';
import {createStyles, LinearProgress, makeStyles, Theme} from '@material-ui/core';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import WhatsNewScreen from '../../../../apps/repository/js/whats_new/WhatsNewScreen';
import {StatsScreen} from '../../../../apps/repository/js/stats/StatsScreen';
import {PricingScreen} from '../../../../apps/repository/js/premium/PricingScreen';
import {SupportScreen} from '../../../../apps/repository/js/support/SupportScreen';
import {AuthRequired} from "../../../../apps/repository/js/AuthRequired";
import {
    PersistenceLayerApp,
    PersistenceLayerContext,
    RepoDocMetaManagerContext
} from "../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {ReactRouters} from "../../react/router/ReactRouters";
import {SettingsScreen} from "../../../../apps/repository/js/configure/settings/SettingsScreen";
import {DeviceScreen} from "../../../../apps/repository/js/device/DeviceScreen";
import {App} from "./RepositoryAppInitializer";
import {Callback} from "polar-shared/src/util/Functions";
import {MUIRepositoryRoot} from "../../mui/MUIRepositoryRoot";
import {DocRepoStore2} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import {
    AnnotationRepoSidebarTagStore
} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoSidebarTagStore";
import {AnnotationRepoStore} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoStore";
import {AnnotationRepoScreen} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoScreen";
import {ReviewRouter} from "../../../../apps/repository/js/reviewer/ReviewerRouter";
import {PersistentRoute} from "./PersistentRoute";
import {Preconditions} from "polar-shared/src/Preconditions";
import {RepositoryRoot} from "./RepositoryRoot";
import {AddFileDropzoneScreen} from './upload/AddFileDropzoneScreen';
import {ErrorScreen} from "../../../../apps/repository/js/ErrorScreen";
import {UseLocationChangeStoreProvider} from '../../../../apps/doc/src/annotations/UseLocationChangeStore';
import {UseLocationChangeRoot} from "../../../../apps/doc/src/annotations/UseLocationChangeRoot";
import {AddFileDropzoneRoot} from './upload/AddFileDropzoneRoot';
import {LogsScreen} from "../../../../apps/repository/js/logs/LogsScreen";
import {FirestorePrefs} from "../../../../apps/repository/js/persistence_layer/FirestorePrefs";
import {LoginWithCustomTokenScreen} from "../../../../apps/repository/js/login/LoginWithCustomTokenScreen";
import {WelcomeScreen} from "./WelcomeScreen";
import {AddMobileScreen} from "./AddMobileScreen";
import {AccountDialogScreen} from "../../ui/cloud_auth/AccountDialogScreen";
import {CreateAccountScreen} from "../../../../apps/repository/js/login/CreateAccountScreen";
import {SignInScreen} from "../../../../apps/repository/js/login/SignInScreen";
import {UserTagsDataLoader} from "../../../../apps/repository/js/persistence_layer/UserTagsDataLoader";
import {BlocksStoreProvider} from "../../notes/store/BlocksStore";
import {BlockStoreDefaultContextProvider} from "../../notes/store/BlockStoreContextProvider";
import {HelloServerSideRender} from "../../ssr/HelloServerSideRender";
import {Initializers} from './Initializers';
import {DocumentRoutes} from './DocumentRoutes';
import {EnableFeatureToggle} from "./EnableFeatureToggle";
import {SideNav, useSidenavWidth} from '../../sidenav/SideNav';
import {MUIBottomNavigation} from "../../mui/MUIBottomNavigation";
import {DocRepoScreen2} from '../../../../apps/repository/js/doc_repo/DocRepoScreen2';
import {DocRepoSidebarTagStore} from '../../../../apps/repository/js/doc_repo/DocRepoSidebarTagStore';
import {Devices} from 'polar-shared/src/util/Devices';
import {useSideNavCallbacks, useSideNavStore} from '../../sidenav/SideNavStore';
import {RoutePathNames} from './RoutePathNames';
import {Intercom} from "./integrations/Intercom";
import {DeviceRouters} from "../../ui/DeviceRouter";
import {AndroidHistoryListener} from "./AndroidHistoryListener";
import {AccountPageMobile} from './AccountPageMobile';
import {CDKDemo} from "./CDKDemo";
import {SwitchScreen} from './SwitchScreen';
import {
    BlocksAnnotationRepoStoreProvider
} from '../../../../apps/repository/js/block_annotation_repo/BlocksAnnotationRepoStore';
import {NoteProviders} from "../../notes/NoteProviders";
import {JumpToNoteKeyboardCommand} from "../../search/JumpToNoteKeyboardCommand";
import {JumpToDocumentKeyboardCommand} from "../../search/JumpToDocumentKeyboardCommand";
import {ActiveKeyboardShortcuts} from "../../hotkeys/ActiveKeyboardShortcuts";
import {MigrationToBlockAnnotations} from "./notes_migration/MigrationToBlockAnnotations"
import {ListUsers} from "./private-beta/ListUsers";
import {ConsoleError} from './ConsoleError';
import {BlocksUserTagsDataLoader} from "../../../../apps/repository/js/persistence_layer/BlocksUserTagsDataLoader";
import {NotesRepoScreen2} from "../../../../apps/repository/js/notes_repo/NotesRepoScreen2";
import {NotesContainer} from '../../notes/NotesContainer';
import {DailyNotesScreen} from '../../notes/DailyNotesScreen';
import {SingleNoteScreen} from '../../notes/SingleNoteScreen';
import {FeaturesScreen} from "../../../../apps/repository/js/configure/settings/FeaturesScreen";
import {ReviewMobileScreen} from './ReviewMobileScreen';
import {SpacedRepCollectionSnapshots} from '../../snapshot_collections/SpacedRepCollectionSnapshots';
import {SpacedRepStatCollectionSnapshots} from '../../snapshot_collections/SpacedRepStatCollectionSnapshots';
import {HeartbeatCollectionSnapshots} from '../../snapshot_collections/HeartbeatCollectionSnapshots';
import {Heartbeater} from "./Heartbeater";
import {MUIAppRootUsingFirestorePrefs} from "./MUIAppRootUsingFirestorePrefs";
import {SearchKeyboardCommand} from '../../search/SearchKeyboardCommand';
import {FeatureEnabled} from '../../features/FeaturesRegistry';
import {UserReferralCollectionSnapshots} from '../../snapshot_collections/UserReferralCollectionSnapshots';
import {InviteScreen} from "../../../../apps/repository/js/login/InviteScreen";
import {KeyboardShortcuts} from "../../keyboard_shortcuts/KeyboardShortcuts";
import {UndoQueueProvider2} from '../../undo/UndoQueueProvider2';
import {ReferralScreen} from "../../../../apps/repository/js/configure/settings/ReferralScreen";
import {AnalyticsLocationListener} from "../../analytics/AnalyticsLocationListener";
import {PersistenceLayerProvider} from "../../datastore/PersistenceLayer";
import {MUIAppRoot} from "../../mui/MUIAppRoot";
import {FreePremiumWithReferralBanner} from "./FreePremiumWithReferralBanner";

interface IProps {
    readonly app: App;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;
    readonly onFileUpload: Callback;
}

interface IUseRouteContainerStylesProps {
    isSidenavOpen: boolean;
    sidenavWidth: number;
}

const useRouteContainerStyles = makeStyles<Theme, IUseRouteContainerStylesProps>((theme) =>
    createStyles({
        root({isSidenavOpen, sidenavWidth}) {

            return {
                display: 'flex',
                minWidth: 0,
                minHeight: 0,
                flexDirection: 'column',
                flexGrow: 1,
                maxWidth: '100%',
                width: '100%',
                height: '100%',
                background: theme.palette.background.default,
                overflowX: 'hidden',
                ...(!Devices.isDesktop() && {
                    position: 'relative',
                    top: 0,
                    zIndex: 2,
                    left: isSidenavOpen ? sidenavWidth : 0,
                    transition: 'left 200ms ease-in-out',
                })
            };
        },
        overlay: {
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: theme.zIndex.tooltip + 100,
            background: 'rgba(0, 0, 0, 0.4)',
        },
    })
);


const FeatureRequestsScreen = () => {
    document.location.href = 'http://feedback.getpolarized.io/feature-requests';
    return null;
};

const ROUTES = [
    {path: RoutePathNames.WHATS_NEW, component: WhatsNewScreen},
    {path: RoutePathNames.PLANS, component: PricingScreen},
    {path: RoutePathNames.PREMIUM, component: PricingScreen},
    {path: RoutePathNames.SUPPORT, component: SupportScreen},
    {path: RoutePathNames.STATISTICS, component: StatsScreen},
    {path: RoutePathNames.SETTINGS, component: SettingsScreen},
    {path: RoutePathNames.FEATURES, component: FeaturesScreen},
    {path: RoutePathNames.LOGS, component: LogsScreen},
    {path: RoutePathNames.DEVICE_INFO, component: DeviceScreen},
    {path: RoutePathNames.FEATURE_REQUESTS, component: FeatureRequestsScreen},
];

const SharedRoutes: React.FC = () => {
    const location = ReactRouters.createLocationWithPathOnly()

    return (
        <>
            {ROUTES.map((props) => <Route key={props.path} exact location={location} {...props} />)}
        </>
    );
};

export const RouteContainer: React.FC = ({children}) => {
    const {isOpen} = useSideNavStore(['isOpen']);
    const {setOpen} = useSideNavCallbacks();
    const sidenavWidth = useSidenavWidth();
    const classes = useRouteContainerStyles({isSidenavOpen: isOpen, sidenavWidth});

    const closeSidenav = React.useCallback(() => setOpen(false), [setOpen]);

    return (
        <>
            <div className={classes.root}>
                {children}
                {isOpen && <div onClick={closeSidenav} className={classes.overlay}/>}
            </div>
        </>
    );
};

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: Devices.isDesktop() ? 'row' : 'column-reverse',
            minWidth: 0,
            minHeight: 0,
            flexGrow: 1,
        },
    }),
);

interface AppProvidersProps {
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly children: React.ReactNode;
}

const AppProviders = React.memo(function AppProviders(props: AppProvidersProps) {

    const {repoDocMetaManager, repoDocMetaLoader, persistenceLayerManager} = props;

    return (
        <FirestorePrefs>
            <MUIAppRootUsingFirestorePrefs>
                <UndoQueueProvider2>
                    <>
                        <KeyboardShortcuts/>
                        <UserTagsDataLoader>
                            <BlocksUserTagsDataLoader>
                                <BlockStoreDefaultContextProvider>
                                    <BlocksStoreProvider>
                                        <PersistenceLayerApp tagsType="documents"
                                                             repoDocMetaManager={repoDocMetaManager}
                                                             repoDocMetaLoader={repoDocMetaLoader}
                                                             persistenceLayerManager={persistenceLayerManager}>
                                            <DocRepoStore2>

                                                {/* TODO move this to a dedicated component */}

                                                {/* Register all the providers first */}

                                                <SpacedRepCollectionSnapshots.Provider>
                                                    <SpacedRepStatCollectionSnapshots.Provider>
                                                        <HeartbeatCollectionSnapshots.Provider>
                                                            <UserReferralCollectionSnapshots.Provider>

                                                                <>

                                                                    {/* Here we have to define ALL the loader so they can execute in
                                                                            parallel and all start listening to snapshots concurrently */}

                                                                    <SpacedRepCollectionSnapshots.Loader/>
                                                                    <SpacedRepStatCollectionSnapshots.Loader/>
                                                                    <HeartbeatCollectionSnapshots.Loader/>
                                                                    <UserReferralCollectionSnapshots.Loader/>

                                                                    {/* Now all the latches that are REQUIRED for the entire app. */}

                                                                    <SpacedRepCollectionSnapshots.Latch
                                                                        fallback={<LinearProgress/>}>
                                                                        <SpacedRepStatCollectionSnapshots.Latch
                                                                            fallback={<LinearProgress/>}>
                                                                            <>
                                                                                {props.children}
                                                                            </>
                                                                        </SpacedRepStatCollectionSnapshots.Latch>
                                                                    </SpacedRepCollectionSnapshots.Latch>

                                                                </>
                                                            </UserReferralCollectionSnapshots.Provider>
                                                        </HeartbeatCollectionSnapshots.Provider>

                                                    </SpacedRepStatCollectionSnapshots.Provider>

                                                </SpacedRepCollectionSnapshots.Provider>

                                            </DocRepoStore2>
                                        </PersistenceLayerApp>
                                    </BlocksStoreProvider>
                                </BlockStoreDefaultContextProvider>
                            </BlocksUserTagsDataLoader>
                        </UserTagsDataLoader>
                    </>
                </UndoQueueProvider2>
            </MUIAppRootUsingFirestorePrefs>
        </FirestorePrefs>
    );
});

interface GlobalProvidersProps {
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly children: React.ReactNode;

}

const GlobalProviders = React.memo(function GlobalProviders(props: GlobalProvidersProps) {

    const {repoDocMetaManager, persistenceLayerProvider} = props;

    return (
        <RepoDocMetaManagerContext.Provider value={repoDocMetaManager}>
            <MUIRepositoryRoot>
                <RepositoryRoot>
                    <PersistenceLayerContext.Provider value={{persistenceLayerProvider}}>
                        <div className="RepositoryApp"
                             style={{
                                 display: 'flex',
                                 minWidth: 0,
                                 minHeight: 0,
                                 flexDirection: 'column',
                                 flexGrow: 1
                             }}>

                            <UseLocationChangeStoreProvider>
                                <BrowserRouter>
                                    <UseLocationChangeRoot>
                                        <>
                                            <AndroidHistoryListener/>
                                            {props.children}
                                        </>
                                    </UseLocationChangeRoot>
                                </BrowserRouter>
                            </UseLocationChangeStoreProvider>
                        </div>
                    </PersistenceLayerContext.Provider>
                </RepositoryRoot>
            </MUIRepositoryRoot>
        </RepoDocMetaManagerContext.Provider>
    )
});

export const RepositoryApp = React.memo(function RepositoryApp(props: IProps) {
    const classes = useStyles();
    const {app, repoDocMetaManager, repoDocMetaLoader, persistenceLayerManager} = props;

    Preconditions.assertPresent(app, 'app');

    const RenderAnnotationRepoScreen = React.memo(function RenderAnnotationRepoScreen() {
        return (
            <PersistenceLayerApp tagsType="annotations"
                                 repoDocMetaManager={repoDocMetaManager}
                                 repoDocMetaLoader={repoDocMetaLoader}
                                 persistenceLayerManager={persistenceLayerManager}>
                <AnnotationRepoStore>
                    <BlocksAnnotationRepoStoreProvider>
                        <AnnotationRepoSidebarTagStore>
                            <ReviewRouter/>
                            <AnnotationRepoScreen/>
                        </AnnotationRepoSidebarTagStore>
                    </BlocksAnnotationRepoStoreProvider>
                </AnnotationRepoStore>
            </PersistenceLayerApp>
        );
    });

    return (
        <GlobalProviders repoDocMetaManager={repoDocMetaManager} persistenceLayerProvider={app.persistenceLayerProvider}>
            <ConsoleError/>
            <AnalyticsLocationListener/>
            <Switch>

                <Route exact path={["/create-account"]}>
                    <MUIAppRoot>
                        <CreateAccountScreen/>
                    </MUIAppRoot>
                </Route>

                <Route exact path="/invite/:user_referral_code">
                    <MUIAppRoot>
                        <InviteScreen/>
                    </MUIAppRoot>
                </Route>

                <Route exact path={["/sign-in", "/login", "/login.html"]}>
                    <MUIAppRoot>
                        <SignInScreen/>
                    </MUIAppRoot>
                </Route>

                <Route exact path={["/login-with-custom-token"]}>
                    <MUIAppRoot>
                        <LoginWithCustomTokenScreen/>
                    </MUIAppRoot>
                </Route>

                <Route exact path="/error">
                    <MUIAppRoot>
                        <ErrorScreen/>
                    </MUIAppRoot>
                </Route>

                <AuthRequired>
                    <AppProviders repoDocMetaLoader={props.repoDocMetaLoader}
                                  persistenceLayerManager={props.persistenceLayerManager}
                                  repoDocMetaManager={props.repoDocMetaManager}>

                        <MigrationToBlockAnnotations>
                            <AddFileDropzoneRoot>

                                <FreePremiumWithReferralBanner/>

                                <div className={classes.root}>

                                    <Initializers/>

                                    <ActiveKeyboardShortcuts/>
                                    <JumpToNoteKeyboardCommand/>
                                    <JumpToDocumentKeyboardCommand/>

                                    <FeatureEnabled feature="local-search">
                                        <SearchKeyboardCommand/>
                                    </FeatureEnabled>

                                    <Heartbeater/>

                                    <SideNav/>
                                    <DeviceRouters.NotDesktop>
                                        <MUIBottomNavigation/>
                                    </DeviceRouters.NotDesktop>
                                    <Intercom/>

                                    <RouteContainer>

                                        <Route exact path="/cdk-demo">
                                            <CDKDemo/>
                                        </Route>

                                        <Route exact path="/private-beta/waiting-users">
                                            <ListUsers/>
                                        </Route>

                                        <Route exact path="/settings/user-referral">
                                            <ReferralScreen/>
                                        </Route>

                                        <PersistentRoute strategy="display" exact path={RoutePathNames.HOME}>
                                            <DocRepoSidebarTagStore>
                                                <DocRepoScreen2/>
                                            </DocRepoSidebarTagStore>
                                        </PersistentRoute>

                                        <PersistentRoute strategy="display" exact path={RoutePathNames.ANNOTATIONS}>
                                            <RenderAnnotationRepoScreen/>
                                        </PersistentRoute>

                                        <PersistentRoute strategy="display" path={RoutePathNames.SWITCH}>
                                            <SwitchScreen/>
                                        </PersistentRoute>

                                        <PersistentRoute strategy="display" path={RoutePathNames.ADD}>
                                            <AddMobileScreen/>
                                        </PersistentRoute>

                                        <PersistentRoute strategy="display" path={RoutePathNames.REVIEW}>
                                            <ReviewMobileScreen/>
                                        </PersistentRoute>

                                        <PersistentRoute strategy="display" path={RoutePathNames.ACCOUNT_MOBILE}>
                                            <AccountPageMobile/>
                                        </PersistentRoute>

                                        <DeviceRouters.Desktop>
                                            <PersistentRoute path={RoutePathNames.NOTES}
                                                             exact
                                                             strategy="display">
                                                <NotesRepoScreen2/>
                                            </PersistentRoute>
                                        </DeviceRouters.Desktop>

                                        <PersistentRoute path={RoutePathNames.DAILY}
                                                         strategy="display"
                                                         exact>
                                            <NotesContainer>
                                                <NoteProviders>
                                                    <DailyNotesScreen/>
                                                </NoteProviders>
                                            </NotesContainer>
                                        </PersistentRoute>

                                        <DocumentRoutes persistenceLayerProvider={app.persistenceLayerProvider}
                                                        repoDocMetaManager={props.repoDocMetaManager}
                                                        repoDocMetaLoader={props.repoDocMetaLoader}
                                                        persistenceLayerManager={props.persistenceLayerManager}/>

                                        <Route path={RoutePathNames.NOTE(":id")}
                                               component={SingleNoteScreen}/>

                                        <Switch location={ReactRouters.createLocationWithPathOnly()}>
                                            <Route exact path={RoutePathNames.ENABLE_FEATURE_TOGGLE}
                                                   component={EnableFeatureToggle}/>

                                            <Route path={RoutePathNames.NOTES} exact>
                                                <DeviceRouters.NotDesktop>
                                                    <NotesRepoScreen2/>
                                                </DeviceRouters.NotDesktop>
                                            </Route>

                                            <Route path="/hello-ssr"
                                                   component={HelloServerSideRender}/>

                                        </Switch>

                                        <SharedRoutes/>
                                    </RouteContainer>
                                </div>

                                {/* the following are small popup screens that can exist anywhere */}
                                <Switch location={ReactRouters.createLocationWithHashOnly()}>

                                    <Route path="#welcome" component={WelcomeScreen}/>

                                    <Route path="#account" component={AccountDialogScreen}/>

                                    <Route path="#add">
                                        <PersistenceLayerContext.Provider
                                            value={{persistenceLayerProvider: app.persistenceLayerProvider}}>
                                            <AddFileDropzoneScreen/>
                                        </PersistenceLayerContext.Provider>
                                    </Route>

                                </Switch>
                            </AddFileDropzoneRoot>
                        </MigrationToBlockAnnotations>

                    </AppProviders>
                </AuthRequired>

            </Switch>

        </GlobalProviders>
    );

});
