import * as React from 'react';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import WhatsNewScreen
    from '../../../../apps/repository/js/whats_new/WhatsNewScreen';
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
import {DocRepoScreen2} from "../../../../apps/repository/js/doc_repo/DocRepoScreen2";
import {DocRepoStore2} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import {DocRepoSidebarTagStore} from "../../../../apps/repository/js/doc_repo/DocRepoSidebarTagStore";
import {AnnotationRepoSidebarTagStore} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoSidebarTagStore";
import {AnnotationRepoStore2} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoStore";
import {AnnotationRepoScreen2} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoScreen2";
import {ReviewRouter} from "../../../../apps/repository/js/reviewer/ReviewerRouter";
import {PersistentRoute} from "./PersistentRoute";
import {LoginScreen} from "../../../../apps/repository/js/login/LoginScreen";
import {UserTagsProvider} from "../../../../apps/repository/js/persistence_layer/UserTagsProvider2";
import {DocMetaContextProvider} from "../../annotation_sidebar/DocMetaContextProvider";
import {DocViewerDocMetaLookupContextProvider} from "../../../../apps/doc/src/DocViewerDocMetaLookupContextProvider";
import {DocViewerStore} from "../../../../apps/doc/src/DocViewerStore";
import {DocFindStore} from "../../../../apps/doc/src/DocFindStore";
import {AnnotationSidebarStoreProvider} from "../../../../apps/doc/src/AnnotationSidebarStore";
import {DocViewer} from "../../../../apps/doc/src/DocViewer";
import {Preconditions} from "polar-shared/src/Preconditions";
import {RepositoryRoot} from "./RepositoryRoot";
import {AddFileDropzoneScreen} from './upload/AddFileDropzoneScreen';
import {AnkiSyncController} from "../../controller/AnkiSyncController";
import {ErrorScreen} from "../../../../apps/repository/js/ErrorScreen";
import {ListenablePersistenceLayerProvider} from "../../datastore/PersistenceLayer";
import {RepoHeader3} from "../../../../apps/repository/js/repo_header/RepoHeader3";
import {RepoFooter} from "../../../../apps/repository/js/repo_footer/RepoFooter";
import {MUIDialogController} from "../../mui/dialogs/MUIDialogController";
import {UseLocationChangeStoreProvider} from '../../../../apps/doc/src/annotations/UseLocationChangeStore';
import {UseLocationChangeRoot} from "../../../../apps/doc/src/annotations/UseLocationChangeRoot";
import {deepMemo} from "../../react/ReactUtils";
import { PHZMigrationScreen } from './migrations/PHZMigrationScreen';
import { AddFileDropzoneRoot } from './upload/AddFileDropzoneRoot';
import {AnalyticsLocationListener} from "../../analytics/AnalyticsLocationListener";
import {LogsScreen} from "../../../../apps/repository/js/logs/LogsScreen";
import {PrefsContext2} from "../../../../apps/repository/js/persistence_layer/PrefsContext2";
import {LoginWithCustomTokenScreen} from "../../../../apps/repository/js/login/LoginWithCustomTokenScreen";
import {WelcomeScreen} from "./WelcomeScreen";
import {SIDE_NAV_ENABLED, useSideNavStore} from '../../sidenav/SideNavStore';
import {SideNav} from "../../sidenav/SideNav";
import Divider from '@material-ui/core/Divider';
import {SideNavInitializer} from "../../sidenav/SideNavInitializer";
import {AccountDialogScreen} from "../../ui/cloud_auth/AccountDialogScreen";
import {CreateAccountScreen} from "../../../../apps/repository/js/login/CreateAccountScreen";
import {SignInScreen} from "../../../../apps/repository/js/login/SignInScreen";

interface IProps {
    readonly app: App;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;
    readonly onFileUpload: Callback;
}

interface RepositoryDocViewerScreenProps {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerManager: PersistenceLayerManager;

}

export const RepositoryDocViewerScreen = deepMemo((props: RepositoryDocViewerScreenProps) => {

    return (
        <AuthRequired>
            <PersistenceLayerContext.Provider value={{persistenceLayerProvider: props.persistenceLayerProvider}}>
                <PersistenceLayerApp tagsType="documents"
                                     repoDocMetaManager={props.repoDocMetaManager}
                                     repoDocMetaLoader={props.repoDocMetaLoader}
                                     persistenceLayerManager={props.persistenceLayerManager}>
                    <PrefsContext2>
                        <AnnotationSidebarStoreProvider>
                            <UserTagsProvider>
                                <DocMetaContextProvider>
                                    <DocViewerStore>
                                        <DocViewerDocMetaLookupContextProvider>
                                            <DocFindStore>
                                                <DocViewer/>
                                            </DocFindStore>
                                        </DocViewerDocMetaLookupContextProvider>
                                    </DocViewerStore>
                                </DocMetaContextProvider>
                            </UserTagsProvider>
                        </AnnotationSidebarStoreProvider>
                    </PrefsContext2>
                </PersistenceLayerApp>
            </PersistenceLayerContext.Provider>
        </AuthRequired>
    );
});

interface SideNavDocumentsProps {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerManager: PersistenceLayerManager;
}

const SideNavDocuments = React.memo(function SideNavDocuments(props: SideNavDocumentsProps) {

    const {tabs} = useSideNavStore(['tabs']);

    return (
        <>
            {tabs.map(tab => (
                <PersistentRoute key={'doc-' + tab.id}
                                 exact
                                 strategy={tab.type === 'pdf' ? 'display' : 'visibility'}
                                 path={tab.url}>

                    <RepositoryDocViewerScreen persistenceLayerProvider={props.persistenceLayerProvider}
                                               repoDocMetaManager={props.repoDocMetaManager}
                                               repoDocMetaLoader={props.repoDocMetaLoader}
                                               persistenceLayerManager={props.persistenceLayerManager}/>

                </PersistentRoute>
            ))}
        </>
    );

});

export const RepositoryApp = React.memo(function RepositoryApp(props: IProps) {

    const {app, repoDocMetaManager, repoDocMetaLoader, persistenceLayerManager} = props;

    Preconditions.assertPresent(app, 'app');

    const RenderDocViewerScreen = React.memo(() => (
        <RepositoryDocViewerScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                   repoDocMetaManager={repoDocMetaManager}
                                   repoDocMetaLoader={repoDocMetaLoader}
                                   persistenceLayerManager={persistenceLayerManager}/>
    ));

    const RenderDocRepoScreen = React.memo(() => (
            <AuthRequired>
                <PersistenceLayerApp tagsType="documents"
                                     repoDocMetaManager={repoDocMetaManager}
                                     repoDocMetaLoader={repoDocMetaLoader}
                                     persistenceLayerManager={persistenceLayerManager}>
                     <DocRepoStore2>
                         <DocRepoSidebarTagStore>
                             <>
                                 <SideNavInitializer/>
                                 <AnkiSyncController/>
                                 <DocRepoScreen2/>
                             </>
                         </DocRepoSidebarTagStore>
                     </DocRepoStore2>
                </PersistenceLayerApp>
            </AuthRequired>
        ));

    RenderDocRepoScreen.displayName='RenderDocRepoScreen';

    const RenderAnnotationRepoScreen = React.memo(() => {
        return (
            <AuthRequired>
                <PersistenceLayerApp tagsType="annotations"
                                     repoDocMetaManager={repoDocMetaManager}
                                     repoDocMetaLoader={repoDocMetaLoader}
                                     persistenceLayerManager={persistenceLayerManager}>
                     <AnnotationRepoStore2>
                         <AnnotationRepoSidebarTagStore>
                             <>
                                 <ReviewRouter/>
                                 <AnnotationRepoScreen2/>
                             </>
                         </AnnotationRepoSidebarTagStore>
                     </AnnotationRepoStore2>
                </PersistenceLayerApp>
            </AuthRequired>
        );
    });

    const RenderSettingsScreen = () => (
        <AuthRequired>
            <PersistenceLayerApp tagsType="documents"
                                 repoDocMetaManager={repoDocMetaManager}
                                 repoDocMetaLoader={repoDocMetaLoader}
                                 persistenceLayerManager={persistenceLayerManager}>
                <SettingsScreen/>
            </PersistenceLayerApp>
        </AuthRequired>
    );

    // const renderProfileScreen = () => (
    //     <Cached>
    //         <ProfileScreen
    //             persistenceLayerProvider={app.persistenceLayerProvider}
    //             persistenceLayerController={app.persistenceLayerController}/>
    //     </Cached>
    // );

    const renderDeviceScreen = () => (
        <DeviceScreen/>
    );

    const RenderDefaultScreen = React.memo(() => (
        <RenderDocRepoScreen/>
    ));

    RenderDefaultScreen.displayName='RenderDefaultScreen';

    const renderWhatsNewScreen = () => (
        <WhatsNewScreen/>
    );

    // const renderCommunityScreen = () => (
    //     <AuthRequired authStatus={authStatus}>
    //         <CommunityScreen persistenceLayerProvider={persistenceLayerProvider}
    //                          persistenceLayerController={persistenceLayerController}/>
    //     </AuthRequired>
    // );

    const renderStatsScreen = () => (
        <AuthRequired>
            <PersistenceLayerApp tagsType="documents"
                                 repoDocMetaManager={repoDocMetaManager}
                                 repoDocMetaLoader={repoDocMetaLoader}
                                 persistenceLayerManager={persistenceLayerManager}>
                <StatsScreen/>
            </PersistenceLayerApp>
        </AuthRequired>
    );

    // const editorsPicksScreen = () => {
    //     return (
    //         <AuthRequired authStatus={authStatus}>
    //             <EditorsPicksScreen persistenceLayerProvider={persistenceLayerProvider}
    //                                 persistenceLayerController={persistenceLayerController}/>
    //         </AuthRequired>
    //         );
    // };
    //
    // const renderCreateGroupScreen = () => {
    //
    //     return (
    //         <AuthRequired authStatus={app.authStatus}>
    //             <CreateGroupScreen
    //                 persistenceLayerProvider={app.persistenceLayerProvider}
    //                 persistenceLayerController={app.persistenceLayerController}
    //                 repoDocMetaManager={repoDocMetaManager}/>
    //         </AuthRequired>
    //     );
    // };

    const premiumScreen = () => {
        return (
            <AuthRequired>
                <PricingScreen/>
            </AuthRequired>
        );
    };

    const supportScreen = () => {
        return (<SupportScreen/>);
    };

    // const renderGroupScreen = () => {
    //     return (
    //         <GroupScreen persistenceLayerProvider={app.persistenceLayerProvider}
    //                      persistenceLayerController={app.persistenceLayerController}/>);
    // };

    // const renderGroupsScreen = () => {
    //     return (<GroupsScreen
    //                 persistenceLayerProvider={app.persistenceLayerProvider}
    //                 persistenceLayerController={app.persistenceLayerController}/>);
    // };
    //
    // const renderGroupHighlightsScreen = () => {
    //     return (<HighlightsScreen
    //                 persistenceLayerProvider={app.persistenceLayerProvider}
    //                 persistenceLayerController={app.persistenceLayerController}/>);
    // };

    // const renderGroupHighlightScreen = () => {
    //     return (<GroupHighlightScreen
    //                 persistenceLayerProvider={app.persistenceLayerProvider}
    //                 persistenceLayerController={app.persistenceLayerController}/>);
    // };

    const renderInvite = () => {
        return <InviteScreen/>;
    };

    return (
        <RepoDocMetaManagerContext.Provider value={repoDocMetaManager}>
            <MUIRepositoryRoot>
                <RepositoryRoot>
                    <PersistenceLayerContext.Provider value={{
                                                          persistenceLayerProvider: app.persistenceLayerProvider
                                                      }}>

                        <div className="RepositoryApp"
                             style={{
                                 display: 'flex',
                                 minWidth: 0,
                                 minHeight: 0,
                                 flexDirection: 'column',
                                 flexGrow: 1
                             }}>

                            <>
                                <UseLocationChangeStoreProvider>
                                    <BrowserRouter>
                                        <AnalyticsLocationListener/>
                                        <UseLocationChangeRoot>
                                            <MUIDialogController>
                                                <AddFileDropzoneRoot>
                                                    <>
                                                        <Switch>

                                                            {/*<Route exact path={["/login", "/login.html"]}>*/}
                                                            {/*    <LoginScreen/>*/}
                                                            {/*</Route>*/}

                                                            <Route exact path={["/create-account"]}>
                                                                <CreateAccountScreen/>
                                                            </Route>

                                                            <Route exact path={["/sign-in", "/login", "/login.html"]}>
                                                                <SignInScreen/>
                                                            </Route>

                                                            <Route exact path={["/login-with-custom-token"]}>
                                                                <LoginWithCustomTokenScreen/>
                                                            </Route>

                                                            {! SIDE_NAV_ENABLED && (
                                                                <Route exact path={["/doc", "/doc/:id"]}>
                                                                    <RenderDocViewerScreen/>
                                                                </Route>)}

                                                            <Route exact path="/error">
                                                                <ErrorScreen/>
                                                            </Route>

                                                            <Route exact path="/migration/phz">
                                                                <PHZMigrationScreen/>
                                                            </Route>

                                                            <Route>

                                                                <div style={{
                                                                    display: 'flex',
                                                                    minWidth: 0,
                                                                    minHeight: 0,
                                                                    flexGrow: 1
                                                                }}>

                                                                    {SIDE_NAV_ENABLED && (
                                                                        <>
                                                                            <SideNav/>
                                                                            <Divider orientation="vertical"/>
                                                                        </> )}

                                                                    <div style={{
                                                                             display: 'flex',
                                                                             minWidth: 0,
                                                                             minHeight: 0,
                                                                             flexDirection: 'column',
                                                                             flexGrow: 1
                                                                         }}>

                                                                        {! SIDE_NAV_ENABLED && <RepoHeader3/>}

                                                                        <PersistentRoute strategy="display" exact path="/">
                                                                            <RenderDefaultScreen/>
                                                                        </PersistentRoute>

                                                                        <PersistentRoute strategy="display" exact path="/annotations">
                                                                            <RenderAnnotationRepoScreen/>
                                                                        </PersistentRoute>

                                                                        {SIDE_NAV_ENABLED && <SideNavDocuments persistenceLayerProvider={app.persistenceLayerProvider}
                                                                                                               repoDocMetaManager={props.repoDocMetaManager}
                                                                                                               repoDocMetaLoader={props.repoDocMetaLoader}
                                                                                                               persistenceLayerManager={props.persistenceLayerManager}/>}

                                                                        <Switch location={ReactRouters.createLocationWithPathOnly()}>

                                                                            <Route exact path='/whats-new'
                                                                                   render={renderWhatsNewScreen}/>

                                                                            <Route exact path='/invite' render={renderInvite}/>

                                                                            <Route exact path='/plans' render={premiumScreen}/>

                                                                            <Route exact path='/premium' render={premiumScreen}/>

                                                                            <Route exact path='/support' render={supportScreen}/>

                                                                            <Route exact path='/stats'
                                                                                   component={renderStatsScreen}/>

                                                                            <Route exact path="/settings"
                                                                                   component={RenderSettingsScreen}/>

                                                                            <Route exact path="/logs"
                                                                                   component={LogsScreen}/>

                                                                            <Route exact path="/device"
                                                                                   component={renderDeviceScreen}/>

                                                                        </Switch>

                                                                        <RepoFooter/>

                                                                    </div>
                                                                </div>

                                                            </Route>

                                                        </Switch>

                                                        {/* the following are small popup screens that can exist anywhere */}
                                                        <Switch location={ReactRouters.createLocationWithHashOnly()}>

                                                            <Route path='#welcome'
                                                                   component={() =>
                                                                       <WelcomeScreen/>
                                                                   }/>

                                                            <Route path='#account'
                                                                   component={() =>
                                                                       <AccountDialogScreen/>
                                                                   }/>

                                                            <Route path='#add'>
                                                                <AuthRequired>
                                                                    <PersistenceLayerContext.Provider value={{persistenceLayerProvider: app.persistenceLayerProvider}}>
                                                                        <AddFileDropzoneScreen/>
                                                                    </PersistenceLayerContext.Provider>
                                                                </AuthRequired>
                                                            </Route>

                                                        </Switch>
                                                    </>
                                                </AddFileDropzoneRoot>

                                            </MUIDialogController>
                                        </UseLocationChangeRoot>
                                 </BrowserRouter>
                                </UseLocationChangeStoreProvider>
                            </>

                        </div>
                    </PersistenceLayerContext.Provider>
                </RepositoryRoot>
            </MUIRepositoryRoot>
        </RepoDocMetaManagerContext.Provider>
    );

});
