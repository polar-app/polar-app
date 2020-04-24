import * as React from 'react';
import {useState} from 'react';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {SyncBar} from '../../ui/sync_bar/SyncBar';
import AnnotationRepoScreen
    from '../../../../apps/repository/js/annotation_repo/AnnotationRepoScreen';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import WhatsNewScreen
    from '../../../../apps/repository/js/whats_new/WhatsNewScreen';
import StatsScreen from '../../../../apps/repository/js/stats/StatsScreen';
import LogsScreen from '../../../../apps/repository/js/logs/LogsScreen';
import Input from 'reactstrap/lib/Input';
import {Splashes} from '../../../../apps/repository/js/splash2/Splashes';
import {PremiumScreen} from '../../../../apps/repository/js/splash/splashes/premium/PremiumScreen';
import {SupportScreen} from '../../../../apps/repository/js/support/SupportScreen';
import DocRepoScreen
    from '../../../../apps/repository/js/doc_repo/DocRepoScreen';
import {CreateGroupScreen} from "../../../../apps/repository/js/groups/create/CreateGroupScreen";
import {GroupsScreen} from "../../../../apps/repository/js/groups/GroupsScreen";
import {GroupScreen} from "../../../../apps/repository/js/group/GroupScreen";
import {AuthRequired} from "../../../../apps/repository/js/AuthRequired";
import {HighlightsScreen} from "../../../../apps/repository/js/group/highlights/HighlightsScreen";
import {GroupHighlightScreen} from "../../../../apps/repository/js/group/highlight/GroupHighlightScreen";
import {PersistenceLayerApp} from "../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {UIComponentsScreen} from "../../../../apps/repository/js/ui-components/UIComponentsScreen";
import {InviteScreen} from "../../../../apps/repository/js/invite/InviteScreen";
import {AccountControlSidebar} from "../../../../apps/repository/js/AccountControlSidebar";
import {ReactRouters} from "../../react/router/ReactRouters";
import {Cached} from '../../react/Cached';
import {CloudSyncConfiguredModal} from "../../ui/cloud_auth/CloudSyncConfiguredModal";
import {SettingsScreen} from "../../../../apps/repository/js/configure/settings/SettingsScreen";
import {DeviceRouter} from "../../ui/DeviceRouter";
import {FeatureToggleRouter} from "../../ui/FeatureToggleRouter";
import {DeviceScreen} from "../../../../apps/repository/js/device/DeviceScreen";
import {ProfileScreen} from "../../../../apps/repository/js/configure/profile/ProfileScreen";
import {App} from "./AppInitializer";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import {GlobalCss} from "../../../spectron0/material-ui/GlobalCss";
import {Callback} from "polar-shared/src/util/Functions";
import {
    MUIThemeTypeContext,
    ThemeType
} from "../../../spectron0/test-context/MUIThemeTypeContext";

interface IProps {
    readonly app: App;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;
    readonly onFileUpload: Callback;
}

export const RepositoryApp = (props: IProps) => {

    const {app, repoDocMetaManager, repoDocMetaLoader, persistenceLayerManager, updatedDocInfoEventDispatcher} = props;

    const renderDocRepoScreen = () => {

        return (
            <Cached>
                <AuthRequired authStatus={app.authStatus}>
                    <PersistenceLayerApp repoDocMetaManager={repoDocMetaManager}
                                         repoDocMetaLoader={repoDocMetaLoader}
                                         persistenceLayerManager={persistenceLayerManager}
                                         render={(docRepo) =>
                                             <DocRepoScreen
                                                 persistenceLayerProvider={app.persistenceLayerProvider}
                                                 persistenceLayerController={app.persistenceLayerController}
                                                 tags={docRepo.docTags}
                                                 docRepo={docRepo}
                                                 updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                                                 repoDocMetaManager={repoDocMetaManager}
                                                 repoDocMetaLoader={repoDocMetaLoader}/>
                                         }/>
                </AuthRequired>
            </Cached>
        );
    };

    const renderSettingsScreen = () => (
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

    const renderAnnotationRepoScreen = () => {
        return (
            <Cached>
                <AuthRequired authStatus={app.authStatus}>
                    <PersistenceLayerApp repoDocMetaManager={repoDocMetaManager}
                                         repoDocMetaLoader={repoDocMetaLoader}
                                         persistenceLayerManager={persistenceLayerManager}
                                         render={(props) =>
                                             <AnnotationRepoScreen
                                                 persistenceLayerManager={persistenceLayerManager}
                                                 persistenceLayerProvider={app.persistenceLayerProvider}
                                                 tags={props.annotationTags}
                                                 updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                                                 repoDocMetaManager={repoDocMetaManager}
                                                 repoDocMetaLoader={repoDocMetaLoader}
                                                 syncBarProgress={app.syncBarProgress}/>
                                         }/>
                </AuthRequired>
            </Cached>
        );
    };

    const renderDefaultScreenByDevice = () => {

        const PhoneAndTablet = () => {

            return (
                <FeatureToggleRouter name="mobile-reading"
                                     enabled={renderDocRepoScreen()}
                                     disabled={renderAnnotationRepoScreen()}/>
            );

        };

        return (
            <Cached>
                <DeviceRouter phone={<PhoneAndTablet/>}
                              tablet={<PhoneAndTablet/>}
                              desktop={renderDocRepoScreen()}/>
            </Cached>
        );

    };

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

    const renderLogsScreen = () => {
        return (
            <AuthRequired authStatus={app.authStatus}>
                <LogsScreen
                    persistenceLayerProvider={app.persistenceLayerProvider}
                    persistenceLayerController={app.persistenceLayerController}/>
            </AuthRequired>
        );
    };

    // const editorsPicksScreen = () => {
    //     return (
    //         <AuthRequired authStatus={authStatus}>
    //             <EditorsPicksScreen persistenceLayerProvider={persistenceLayerProvider}
    //                                 persistenceLayerController={persistenceLayerController}/>
    //         </AuthRequired>
    //         );
    // };

    const renderCreateGroupScreen = () => {

        return (
            <AuthRequired authStatus={app.authStatus}>
                <CreateGroupScreen
                    persistenceLayerProvider={app.persistenceLayerProvider}
                    persistenceLayerController={app.persistenceLayerController}
                    repoDocMetaManager={repoDocMetaManager}/>
            </AuthRequired>
        );
    };

    const plan = app.account ? app.account.plan : 'free';

    const premiumScreen = () => {
        return (<PremiumScreen
                    persistenceLayerProvider={app.persistenceLayerProvider}
                    persistenceLayerController={app.persistenceLayerController}
                    plan={plan}
                    userInfo={app.userInfo}/>);
    };

    const premiumScreenYear = () => {
        return (<PremiumScreen
                    persistenceLayerProvider={app.persistenceLayerProvider}
                    persistenceLayerController={app.persistenceLayerController}
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

    const renderGroupScreen = () => {
        return (
            <GroupScreen persistenceLayerProvider={app.persistenceLayerProvider}
                         persistenceLayerController={app.persistenceLayerController}/>);
    };

    const renderGroupsScreen = () => {
        return (<GroupsScreen
                    persistenceLayerProvider={app.persistenceLayerProvider}
                    persistenceLayerController={app.persistenceLayerController}/>);
    };

    const renderGroupHighlightsScreen = () => {
        return (<HighlightsScreen
                    persistenceLayerProvider={app.persistenceLayerProvider}
                    persistenceLayerController={app.persistenceLayerController}/>);
    };

    const renderGroupHighlightScreen = () => {
        return (<GroupHighlightScreen
                    persistenceLayerProvider={app.persistenceLayerProvider}
                    persistenceLayerController={app.persistenceLayerController}/>);
    };

    const renderInvite = () => {
        return <InviteScreen
                    persistenceLayerProvider={app.persistenceLayerProvider}
                    persistenceLayerController={app.persistenceLayerController}
                    plan={app.account?.plan}/>;
    };

    const [theme, setTheme] = useState<ThemeType>("light");

    const muiTheme = createMuiTheme({
        // FIXME on mobile we use 16px ...
        typography: {
            htmlFontSize: 12,
            fontSize: 12
        },
        palette: {
            type: theme
        }
    });

    return (
        <MuiThemeProvider theme={muiTheme}>
            <MUIThemeTypeContext.Provider value={{theme, setTheme}}>

            <CssBaseline/>
            <GlobalCss/>

            <Splashes key="splashes"
                      persistenceLayerManager={persistenceLayerManager}/>

            <SyncBar key="sync-bar" progress={app.syncBarProgress}/>

            <>

                <BrowserRouter key="browser-router">

                    <Switch
                        location={ReactRouters.createLocationWithPathAndHash()}>

                    </Switch>

                </BrowserRouter>

                <BrowserRouter key="path-router">

                    <Switch
                        location={ReactRouters.createLocationWithPathOnly()}>

                        <Route exact path='/logs' render={renderLogsScreen}/>

                        <Route exact path='/whats-new'
                               render={renderWhatsNewScreen}/>

                        <Route path='/group/:group/highlights'
                               render={renderGroupHighlightsScreen}/>

                        <Route path='/group/:group/docs'
                               render={renderGroupScreen}/>

                        <Route path='/group/:group/highlight/:id'
                               render={renderGroupHighlightScreen}/>

                        <Route path='/group/:group'
                               render={renderGroupHighlightsScreen}/>

                        <Route exact path='/groups'
                               render={renderGroupsScreen}/>

                        <Route exact path='/groups/create'
                               render={renderCreateGroupScreen}/>

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

                        <Route exact path="/annotations"
                               component={renderAnnotationRepoScreen}/>

                        <Route exact path="/settings"
                               component={renderSettingsScreen}/>

                        <Route exact path="/profile"
                               component={renderProfileScreen}/>

                        <Route exact path="/device"
                               component={renderDeviceScreen}/>

                        <Route exact path='/'
                               component={renderDefaultScreenByDevice}/>

                    </Switch>

                    <Switch
                        location={ReactRouters.createLocationWithHashOnly()}>

                        <Route path='#configured'
                               component={() =>
                                   <Cached>
                                       <CloudSyncConfiguredModal/>
                                   </Cached>
                               }/>

                        <Route path='#account'
                               component={() =>
                                   <Cached>
                                       <AccountControlSidebar
                                           persistenceLayerProvider={app.persistenceLayerProvider}
                                           persistenceLayerController={app.persistenceLayerController}/>
                                   </Cached>
                               }/>

                        {/*TODO: add a logout splash so that the user knows that they are unauthenticated.*/}
                        <Route path='#logout'
                               render={() => (
                                   <div></div>
                               )}/>

                    </Switch>

                </BrowserRouter>

            </>

            <Input key="file-upload"
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

            {/*</Container>*/}

            </MUIThemeTypeContext.Provider>
        </MuiThemeProvider>
    );

};

function getRootElement() {

    const rootElement = document.getElementById('root') as HTMLElement;

    if (! rootElement) {
        throw new Error("No root element to which to render");
    }

    return rootElement;

}

