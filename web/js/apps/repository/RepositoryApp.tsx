import * as React from 'react';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {SyncBar} from '../../ui/sync_bar/SyncBar';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import WhatsNewScreen
    from '../../../../apps/repository/js/whats_new/WhatsNewScreen';
import StatsScreen from '../../../../apps/repository/js/stats/StatsScreen';
import {PremiumScreen} from '../../../../apps/repository/js/splash/splashes/premium/PremiumScreen';
import {SupportScreen} from '../../../../apps/repository/js/support/SupportScreen';
import {AuthRequired} from "../../../../apps/repository/js/AuthRequired";
import {PersistenceLayerApp} from "../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {UIComponentsScreen} from "../../../../apps/repository/js/ui-components/UIComponentsScreen";
import {InviteScreen} from "../../../../apps/repository/js/invite/InviteScreen";
import {AccountControlSidebar} from "../../../../apps/repository/js/AccountControlSidebar";
import {ReactRouters} from "../../react/router/ReactRouters";
import {Cached} from '../../react/Cached';
import {SettingsScreen} from "../../../../apps/repository/js/configure/settings/SettingsScreen";
import {DeviceScreen} from "../../../../apps/repository/js/device/DeviceScreen";
import {ProfileScreen} from "../../../../apps/repository/js/configure/profile/ProfileScreen";
import {App} from "./AppInitializer";
import {Callback} from "polar-shared/src/util/Functions";
import {MUIAppRoot} from "../../mui/MUIAppRoot";
import {DocRepoScreen2} from "../../../../apps/repository/js/doc_repo/DocRepoScreen2";
import {MUIDialogController} from "../../mui/dialogs/MUIDialogController";
import {DocRepoStore2} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import {DocRepoSidebarTagStore} from "../../../../apps/repository/js/doc_repo/DocRepoSidebarTagStore";
import {AnnotationRepoSidebarTagStore} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoSidebarTagStore";
import {AnnotationRepoStore2} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoStore";
import {AnnotationRepoScreen2} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoScreen2";
import {ReviewRouter} from "../../../../apps/repository/js/reviewer/ReviewerRouter";
import {PersistentRoute} from "./PersistentRoute";
import {RepoHeader3} from "../../../../apps/repository/js/repo_header/RepoHeader3";
import {RepoFooter} from "../../../../apps/repository/js/repo_footer/RepoFooter";
import {LogoutDialog} from "../../../../apps/repository/js/LogoutDialog";

interface IProps {
    readonly app: App;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;
    readonly onFileUpload: Callback;
}

export const RepositoryApp = (props: IProps) => {

    const {app, repoDocMetaManager, repoDocMetaLoader, persistenceLayerManager} = props;

    const RenderDocRepoScreen = React.memo(() => (
            <AuthRequired authStatus={app.authStatus}>
                <PersistenceLayerApp tagsType="documents"
                                     repoDocMetaManager={repoDocMetaManager}
                                     repoDocMetaLoader={repoDocMetaLoader}
                                     persistenceLayerManager={persistenceLayerManager}
                                     render={(docRepo) =>
                                         <MUIDialogController>
                                             <DocRepoStore2>
                                                 <DocRepoSidebarTagStore>
                                                     <DocRepoScreen2/>
                                                 </DocRepoSidebarTagStore>
                                             </DocRepoStore2>
                                         </MUIDialogController>
                                     }/>
            </AuthRequired>
        ));

    const RenderAnnotationRepoScreen = React.memo(() => {
        return (
            <AuthRequired authStatus={app.authStatus}>
                <PersistenceLayerApp tagsType="annotations"
                                     repoDocMetaManager={repoDocMetaManager}
                                     repoDocMetaLoader={repoDocMetaLoader}
                                     persistenceLayerManager={persistenceLayerManager}
                                     render={(props) =>
                                         <MUIDialogController>
                                             <AnnotationRepoStore2>
                                                 <AnnotationRepoSidebarTagStore>
                                                     <>
                                                         <ReviewRouter/>
                                                         <AnnotationRepoScreen2/>
                                                     </>
                                                 </AnnotationRepoSidebarTagStore>
                                             </AnnotationRepoStore2>
                                         </MUIDialogController>
                                     }/>
            </AuthRequired>
        );
    });

    const LogoutScreen = React.memo(() => {
        return (
            <AuthRequired authStatus={app.authStatus}>
                <PersistenceLayerApp tagsType="annotations"
                                     repoDocMetaManager={repoDocMetaManager}
                                     repoDocMetaLoader={repoDocMetaLoader}
                                     persistenceLayerManager={persistenceLayerManager}
                                     render={(props) =>
                                         <MUIDialogController>
                                             <LogoutDialog/>
                                         </MUIDialogController>
                                     }/>
            </AuthRequired>
        );
    });

    const RenderSettingsScreen = () => (
        <Cached>
            <SettingsScreen
                persistenceLayerProvider={app.persistenceLayerProvider}
                persistenceLayerController={app.persistenceLayerController}/>
        </Cached>
    );

    const renderProfileScreen = () => (
        <Cached>
            <ProfileScreen
                persistenceLayerProvider={app.persistenceLayerProvider}
                persistenceLayerController={app.persistenceLayerController}/>
        </Cached>
    );

    const renderDeviceScreen = () => (
        <Cached>
            <DeviceScreen
                persistenceLayerProvider={app.persistenceLayerProvider}
                persistenceLayerController={app.persistenceLayerController}/>
        </Cached>
    );

    const RenderDefaultScreen = React.memo(() => (
        <RenderDocRepoScreen/>
    ));

    const renderWhatsNewScreen = () => (
        <WhatsNewScreen persistenceLayerProvider={app.persistenceLayerProvider}
                        persistenceLayerController={app.persistenceLayerController}/>
    );

    // const renderCommunityScreen = () => (
    //     <AuthRequired authStatus={authStatus}>
    //         <CommunityScreen persistenceLayerProvider={persistenceLayerProvider}
    //                          persistenceLayerController={persistenceLayerController}/>
    //     </AuthRequired>
    // );

    const renderStatsScreen = () => (
        <AuthRequired authStatus={app.authStatus}>
            <StatsScreen persistenceLayerProvider={app.persistenceLayerProvider}
                         persistenceLayerController={app.persistenceLayerController}
                         repoDocMetaManager={repoDocMetaManager}/>
        </AuthRequired>
    );

    // const renderLogsScreen = () => {
    //     return (
    //         <AuthRequired authStatus={app.authStatus}>
    //             <LogsScreen
    //                 persistenceLayerProvider={app.persistenceLayerProvider}
    //                 persistenceLayerController={app.persistenceLayerController}/>
    //         </AuthRequired>
    //     );
    // };

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

    const plan = app.account ? app.account.plan : 'free';

    const premiumScreen = () => {
        return (<PremiumScreen
                    plan={plan}
                    userInfo={app.userInfo}/>);
    };

    const premiumScreenYear = () => {
        return (<PremiumScreen
                    plan={plan}
                    interval='year'
                    userInfo={app.userInfo}/>);
    };

    const supportScreen = () => {
        return (<SupportScreen
                    persistenceLayerProvider={app.persistenceLayerProvider}
                    persistenceLayerController={app.persistenceLayerController}
                    plan={plan}/>);
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
        return <InviteScreen
                    persistenceLayerProvider={app.persistenceLayerProvider}
                    persistenceLayerController={app.persistenceLayerController}
                    plan={app.account?.plan}/>;
    };


    return (
        <MUIAppRoot>
            <div style={{
                     display: 'flex',
                     minHeight: 0,
                     flexDirection: 'column',
                     flexGrow: 1
                 }}>
            {/*<Splashes key="splashes"*/}
            {/*          persistenceLayerManager={persistenceLayerManager}/>*/}

            <SyncBar key="sync-bar" progress={app.syncBarProgress}/>

                <>

                <BrowserRouter key="browser-router">

                    <Switch
                        location={ReactRouters.createLocationWithPathAndHash()}>

                    </Switch>

                </BrowserRouter>

                <BrowserRouter key="path-router">

                    <RepoHeader3 />

                    <Switch
                        location={ReactRouters.createLocationWithPathOnly()}>

                        {/*<Route exact path='/logs' render={renderLogsScreen}/>*/}

                        <Route exact path='/whats-new'
                               render={renderWhatsNewScreen}/>

                        {/*<Route path='/group/:group/highlights'*/}
                        {/*       render={renderGroupHighlightsScreen}/>*/}

                        {/*<Route path='/group/:group/docs'*/}
                        {/*       render={renderGroupScreen}/>*/}

                        {/*<Route path='/group/:group/highlight/:id'*/}
                        {/*       render={renderGroupHighlightScreen}/>*/}

                        {/*<Route path='/group/:group'*/}
                        {/*       render={renderGroupHighlightsScreen}/>*/}

                        {/*<Route exact path='/groups'*/}
                        {/*       render={renderGroupsScreen}/>*/}

                        {/*<Route exact path='/groups/create'*/}
                        {/*       render={renderCreateGroupScreen}/>*/}

                        <Route exact path='/invite' render={renderInvite}/>

                        <Route exact path='/plans' render={premiumScreen}/>

                        <Route exact path='/plans-year'
                               render={premiumScreenYear}/>

                        <Route exact path='/ui-components'
                               render={() => <UIComponentsScreen
                                   persistenceLayerManager={persistenceLayerManager}
                                   persistenceLayerProvider={app.persistenceLayerProvider}/>}/>

                        <Route exact path='/premium' render={premiumScreen}/>

                        <Route exact path='/support' render={supportScreen}/>

                        <Route exact path='/stats'
                               component={renderStatsScreen}/>

                        {/*<Route exact path="/annotations"*/}
                        {/*       component={RenderAnnotationRepoScreen}/>*/}

                        <Route exact path="/settings"
                               component={RenderSettingsScreen}/>

                        <Route exact path="/profile"
                               component={renderProfileScreen}/>

                        <Route exact path="/device"
                               component={renderDeviceScreen}/>

                        {/*<Route exact path='/'*/}
                        {/*       component={RenderDefaultScreen}/>*/}

                        {/*<Route exact path='/'>*/}
                        {/*    <RenderDefaultScreen/>*/}
                        {/*</Route>*/}

                    </Switch>

                    <PersistentRoute exact path="/">
                        <RenderDefaultScreen/>
                    </PersistentRoute>

                    <PersistentRoute exact path="/annotations">
                        <RenderAnnotationRepoScreen/>
                    </PersistentRoute>

                    <Switch
                        location={ReactRouters.createLocationWithHashOnly()}>

                        <Route path='#account'
                               component={() =>
                                   <Cached>
                                       <AccountControlSidebar
                                           persistenceLayerProvider={app.persistenceLayerProvider}
                                           persistenceLayerController={app.persistenceLayerController}/>
                                   </Cached>
                               }/>

                        {/*TODO: add a logout splash so that the user knows that they are unauthenticated.*/}
                        <Route path='#logout'>
                            <LogoutScreen/>
                        </Route>

                    </Switch>

                    <RepoFooter/>

                </BrowserRouter>

            </>

            <input key="file-upload"
                   type="file"
                   id="file-upload"
                   name="file-upload"
                   accept=".pdf, .PDF"
                   multiple
                   onChange={() => props.onFileUpload()}
                   style={{
                       width: 0,
                       height: 0,
                       opacity: 0
                   }}/>

            </div>
        </MUIAppRoot>
    );

};

function getRootElement() {

    const rootElement = document.getElementById('root') as HTMLElement;

    if (! rootElement) {
        throw new Error("No root element to which to render");
    }

    return rootElement;

}

