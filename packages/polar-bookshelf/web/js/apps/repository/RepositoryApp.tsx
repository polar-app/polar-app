import * as React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core';
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
import {InviteScreen} from "../../../../apps/repository/js/invite/InviteScreen";
import {ReactRouters} from "../../react/router/ReactRouters";
import {SettingsScreen} from "../../../../apps/repository/js/configure/settings/SettingsScreen";
import {DeviceScreen} from "../../../../apps/repository/js/device/DeviceScreen";
import {App} from "./AppInitializer";
import {Callback} from "polar-shared/src/util/Functions";
import {MUIRepositoryRoot} from "../../mui/MUIRepositoryRoot";
import {DocRepoStore2} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import {AnnotationRepoSidebarTagStore} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoSidebarTagStore";
import {AnnotationRepoStore} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoStore";
import {AnnotationRepoScreen} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoScreen";
import {ReviewRouter} from "../../../../apps/repository/js/reviewer/ReviewerRouter";
import {PersistentRoute} from "./PersistentRoute";
import {Preconditions} from "polar-shared/src/Preconditions";
import {RepositoryRoot} from "./RepositoryRoot";
import {AddFileDropzoneScreen} from './upload/AddFileDropzoneScreen';
import {ErrorScreen} from "../../../../apps/repository/js/ErrorScreen";
import {MUIDialogController} from "../../mui/dialogs/MUIDialogController";
import {UseLocationChangeStoreProvider} from '../../../../apps/doc/src/annotations/UseLocationChangeStore';
import {UseLocationChangeRoot} from "../../../../apps/doc/src/annotations/UseLocationChangeRoot";
import {PHZMigrationScreen} from './migrations/PHZMigrationScreen';
import {AddFileDropzoneRoot} from './upload/AddFileDropzoneRoot';
import {LogsScreen} from "../../../../apps/repository/js/logs/LogsScreen";
import {FeatureToggleEnabled, PrefsContext2} from "../../../../apps/repository/js/persistence_layer/PrefsContext2";
import {LoginWithCustomTokenScreen} from "../../../../apps/repository/js/login/LoginWithCustomTokenScreen";
import {WelcomeScreen} from "./WelcomeScreen";
import {AddFilesMobileScreen} from "./AddFilesMobileScreen";
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
import {BlocksAnnotationRepoStoreProvider} from '../../../../apps/repository/js/block_annotation_repo/BlocksAnnotationRepoStore';
import {NotesRepoScreen} from "../../notes/NotesRepoScreen";
import {NotesScreen} from "../../notes/NoteScreen";
import {ActiveKeyboardShortcuts2} from "../../hotkeys/ActiveKeyboardShortcuts2";
import {JumpToNoteKeyboardCommand} from "../../notes/JumpToNoteKeyboardCommand";

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

const SHARED_ROUTES = [
    {path: RoutePathNames.WHATS_NEW, component: (WhatsNewScreen)},
    {path: RoutePathNames.INVITE, component: (InviteScreen)},
    {path: RoutePathNames.PLANS, component: (PricingScreen)},
    {path: RoutePathNames.PREMIUM, component: (PricingScreen)},
    {path: RoutePathNames.SUPPORT, component: (SupportScreen)},
    {path: RoutePathNames.STATISTICS, component: (StatsScreen)},
    {path: RoutePathNames.SETTINGS, component: (SettingsScreen)},
    {path: RoutePathNames.LOGS, component: (LogsScreen)},
    {path: RoutePathNames.DEVICE_INFO, component: (DeviceScreen)},
    {path: RoutePathNames.FEATURE_REQUESTS, component: (FeatureRequestsScreen)},
];

const SharedRoutes: React.FC = () => {
    const location = ReactRouters.createLocationWithPathOnly()

    return (
        <>
            {SHARED_ROUTES.map((props) => <Route key={props.path} exact location={location} {...props} />)}
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

export const RepositoryApp = React.memo(function RepositoryApp(props: IProps) {
    const classes = useStyles();
    const {app, repoDocMetaManager, repoDocMetaLoader, persistenceLayerManager} = props;

    Preconditions.assertPresent(app, 'app');

    const DataProviders: React.FC = React.useCallback(({children}) => (
        <PrefsContext2>
            <UserTagsDataLoader>
                <BlockStoreDefaultContextProvider>
                    <BlocksStoreProvider>
                        <PersistenceLayerApp tagsType="documents"
                                             repoDocMetaManager={repoDocMetaManager}
                                             repoDocMetaLoader={repoDocMetaLoader}
                                             persistenceLayerManager={persistenceLayerManager}>
                            <DocRepoStore2>
                                {children}
                            </DocRepoStore2>
                        </PersistenceLayerApp>
                    </BlocksStoreProvider>
                </BlockStoreDefaultContextProvider>
            </UserTagsDataLoader>
        </PrefsContext2>
    ), [repoDocMetaManager, repoDocMetaLoader, persistenceLayerManager]);

    const GlobalProviders: React.FC = React.useCallback(({children}) => (
        <RepoDocMetaManagerContext.Provider value={repoDocMetaManager}>
            <MUIRepositoryRoot>
                <RepositoryRoot>
                    <PersistenceLayerContext.Provider value={{persistenceLayerProvider: app.persistenceLayerProvider}}>
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
                                        <MUIDialogController>
                                            <AddFileDropzoneRoot>
                                                <>
                                                    <AndroidHistoryListener/>
                                                    {children}
                                                </>
                                            </AddFileDropzoneRoot>
                                        </MUIDialogController>
                                    </UseLocationChangeRoot>
                                </BrowserRouter>
                            </UseLocationChangeStoreProvider>
                        </div>
                    </PersistenceLayerContext.Provider>
                </RepositoryRoot>
            </MUIRepositoryRoot>
        </RepoDocMetaManagerContext.Provider>
    ), [repoDocMetaManager, app.persistenceLayerProvider]);

    const RenderAnnotationRepoScreen = React.memo(function RenderAnnotationRepoScreen() {
        return (
            <PersistenceLayerApp tagsType="annotations"
                                 repoDocMetaManager={repoDocMetaManager}
                                 repoDocMetaLoader={repoDocMetaLoader}
                                 persistenceLayerManager={persistenceLayerManager}>
                <AnnotationRepoStore>
                    <BlocksAnnotationRepoStoreProvider>
                        <AnnotationRepoSidebarTagStore>
                            <>
                                <ReviewRouter/>
                                <AnnotationRepoScreen/>
                            </>
                        </AnnotationRepoSidebarTagStore>
                    </BlocksAnnotationRepoStoreProvider>
                </AnnotationRepoStore>
            </PersistenceLayerApp>
        );
    });

    return (
        <GlobalProviders>
            <Switch>
                <Route exact path={["/create-account"]}>
                    <CreateAccountScreen/>
                </Route>

                <Route exact path={["/sign-in", "/login", "/login.html"]}>
                    <SignInScreen/>
                </Route>

                <Route exact path={["/login-with-custom-token"]}>
                    <LoginWithCustomTokenScreen/>
                </Route>

                <Route exact path="/error">
                    <ErrorScreen/>
                </Route>

                <Route exact path="/migration/phz">
                    <PHZMigrationScreen/>
                </Route>

                <AuthRequired>
                    <DataProviders>
                        <div className={classes.root}>

                            <Initializers/>

                            <ActiveKeyboardShortcuts2/>
                            <JumpToNoteKeyboardCommand />

                            <SideNav/>
                            <DeviceRouters.NotDesktop>
                                <MUIBottomNavigation/>
                            </DeviceRouters.NotDesktop>
                            <Intercom/>

                            <RouteContainer>

                                <Route exact path="/cdk-demo">
                                    <CDKDemo/>
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

                                <PersistentRoute strategy="display" path={RoutePathNames.ADD_MOBILE}>
                                    <AddFilesMobileScreen/>
                                </PersistentRoute>

                                <PersistentRoute strategy="display" path={RoutePathNames.ACCOUNT_MOBILE}>
                                    <AccountPageMobile/>
                                </PersistentRoute>

                                <DocumentRoutes persistenceLayerProvider={app.persistenceLayerProvider}
                                                repoDocMetaManager={props.repoDocMetaManager}
                                                repoDocMetaLoader={props.repoDocMetaLoader}
                                                persistenceLayerManager={props.persistenceLayerManager}/>

                                <Switch location={ReactRouters.createLocationWithPathOnly()}>
                                    <Route exact path={RoutePathNames.ENABLE_FEATURE_TOGGLE}
                                           component={EnableFeatureToggle}/>

                                    <FeatureToggleEnabled featureName="notes-enabled">

                                        <>

                                            <PersistentRoute path={RoutePathNames.NOTES}
                                                             exact
                                                             strategy="display">
                                                <NotesRepoScreen/>
                                            </PersistentRoute>

                                            <Route path={RoutePathNames.DAILY}
                                                   component={NotesScreen}/>

                                            <Route path={`${RoutePathNames.NOTES}/:id`}
                                                   component={NotesScreen}/>

                                        </>

                                    </FeatureToggleEnabled>

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

                    </DataProviders>
                </AuthRequired>

            </Switch>

        </GlobalProviders>
    );

});
