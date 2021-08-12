import * as React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core';
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
import {DocRepoStore2} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import {AnnotationRepoSidebarTagStore} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoSidebarTagStore";
import {AnnotationRepoStore2} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoStore";
import {AnnotationRepoScreen2} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoScreen2";
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
import {PrefsContext2} from "../../../../apps/repository/js/persistence_layer/PrefsContext2";
import {LoginWithCustomTokenScreen} from "../../../../apps/repository/js/login/LoginWithCustomTokenScreen";
import {WelcomeScreen} from "./WelcomeScreen";
import Divider from '@material-ui/core/Divider';
import {AccountDialogScreen} from "../../ui/cloud_auth/AccountDialogScreen";
import {CreateAccountScreen} from "../../../../apps/repository/js/login/CreateAccountScreen";
import {SignInScreen} from "../../../../apps/repository/js/login/SignInScreen";
import {UserTagsDataLoader} from "../../../../apps/repository/js/persistence_layer/UserTagsDataLoader";
import {BlocksStoreProvider} from "../../notes/store/BlocksStore";
import {BlockStoreDefaultContextProvider} from "../../notes/store/BlockStoreContextProvider";
import {NotesScreen} from '../../notes/NoteScreen';
import {HelloServerSideRender} from "../../ssr/HelloServerSideRender";
import {DefaultScreen} from './DefaultScreen';
import {Initializers} from './Initializers';
import {DocumentScreens} from './DocumentScreens';
import {EnableFeatureToggle} from "./EnableFeatureToggle";
import {Nav} from "../../../../apps/repository/js/Nav";
import {Devices} from '../../../../../polar-app-public/polar-shared/src/util/Devices';

interface IProps {
    readonly app: App;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;
    readonly onFileUpload: Callback;
}


interface IRootStylesProps {
    type: 'vertical' | 'horizontal';
}
const useStyles = makeStyles<Theme, IRootStylesProps>(() =>
    createStyles({
        root({ type }) {
            return {
                display: 'flex',
                minWidth: 0,
                minHeight: 0,
                flexGrow: 1,
                flexDirection: type === 'vertical' ? 'column-reverse' : 'row',
            };
        }
    }),
);

export const RepositoryApp = React.memo(function RepositoryApp(props: IProps) {

    const classes = useStyles({ type: Devices.isPhone() ? 'vertical' : 'horizontal' });
    const { app, repoDocMetaManager, repoDocMetaLoader, persistenceLayerManager } = props;

    Preconditions.assertPresent(app, 'app');

    const DataProviders: React.FC = React.useCallback(({ children }) => (
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

    const GlobalProviders: React.FC = React.useCallback(({ children }) => (
        <RepoDocMetaManagerContext.Provider value={repoDocMetaManager}>
            <MUIRepositoryRoot>
                <RepositoryRoot>
                    <PersistenceLayerContext.Provider value={{ persistenceLayerProvider: app.persistenceLayerProvider }}>
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
                                                {children}
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
    ), []);

    const RenderAnnotationRepoScreen = React.memo(function RenderAnnotationRepoScreen() {
        return (
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
        );
    });

    const RenderSettingsScreen = () => (
        <PersistenceLayerApp tagsType="documents"
                             repoDocMetaManager={repoDocMetaManager}
                             repoDocMetaLoader={repoDocMetaLoader}
                             persistenceLayerManager={persistenceLayerManager}>
            <SettingsScreen/>
        </PersistenceLayerApp>
    );

    const renderDeviceScreen = () => (
        <DeviceScreen/>
    );

    const renderWhatsNewScreen = () => (
        <WhatsNewScreen/>
    );

    const renderStatsScreen = () => (
        <PersistenceLayerApp tagsType="documents"
                             repoDocMetaManager={repoDocMetaManager}
                             repoDocMetaLoader={repoDocMetaLoader}
                             persistenceLayerManager={persistenceLayerManager}>
            <StatsScreen/>
        </PersistenceLayerApp>
    );

    const premiumScreen = () => {
        return (
            <PricingScreen/>
        );
    };

    const supportScreen = () => {
        return (<SupportScreen/>);
    };

    const renderInvite = () => {
        return <InviteScreen/>;
    };

    const FeatureRequestsScreen = () => {
        document.location.href = 'http://feedback.getpolarized.io/feature-requests';
        return null;
    };

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

                            <Initializers />

                            <Nav />

                            <div style={{
                                     display: 'flex',
                                     minWidth: 0,
                                     minHeight: 0,
                                     flexDirection: 'column',
                                     flexGrow: 1
                                 }}>

                                <PersistentRoute strategy="display" exact path="/">
                                    <DefaultScreen/>
                                </PersistentRoute>

                                <PersistentRoute strategy="display" exact path="/annotations">
                                    <RenderAnnotationRepoScreen/>
                                </PersistentRoute>

                                <DocumentScreens persistenceLayerProvider={app.persistenceLayerProvider}
                                                 repoDocMetaManager={props.repoDocMetaManager}
                                                 repoDocMetaLoader={props.repoDocMetaLoader}
                                                 persistenceLayerManager={props.persistenceLayerManager}/>

                                <Switch location={ReactRouters.createLocationWithPathOnly()}>
                                    <Route exact path='/enable-feature-toggle'
                                           component={EnableFeatureToggle}/>

                                    <Route exact path="/whats-new"
                                           render={renderWhatsNewScreen}/>

                                    <Route exact path="/invite" render={renderInvite}/>

                                    <Route exact path="/plans" render={premiumScreen}/>

                                    <Route exact path="/premium" render={premiumScreen}/>

                                    <Route exact path="/support" render={supportScreen}/>

                                    <Route exact path="/stats"
                                           component={renderStatsScreen}/>

                                    <Route exact path="/settings"
                                           component={RenderSettingsScreen}/>

                                    <Route exact path="/logs"
                                           component={LogsScreen}/>

                                    <Route exact path="/device"
                                           component={renderDeviceScreen}/>

                                    <Route exact path="/feature-requests"
                                           component={FeatureRequestsScreen}/>

                                    <Route path="/notes"
                                           component={NotesScreen}/>

                                    <Route path="/hello-ssr"
                                           component={HelloServerSideRender}/>

                                </Switch>

                            </div>
                        </div>

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
                                <PersistenceLayerContext.Provider value={{persistenceLayerProvider: app.persistenceLayerProvider}}>
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
