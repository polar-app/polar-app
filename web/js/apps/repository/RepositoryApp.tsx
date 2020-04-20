import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {FileImportController} from './FileImportController';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {AppInstance} from '../../electron/framework/AppInstance';
import {
    PersistenceLayerManager,
    PersistenceLayerTypes
} from '../../datastore/PersistenceLayerManager';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {SyncBar} from '../../ui/sync_bar/SyncBar';
import {DocRepoAnkiSyncController} from '../../controller/DocRepoAnkiSyncController';
import AnnotationRepoScreen
    from '../../../../apps/repository/js/annotation_repo/AnnotationRepoScreen';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PersistenceLayerEvent} from '../../datastore/PersistenceLayerEvent';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {CloudService} from '../../../../apps/repository/js/cloud/CloudService';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import WhatsNewScreen
    from '../../../../apps/repository/js/whats_new/WhatsNewScreen';
import StatsScreen from '../../../../apps/repository/js/stats/StatsScreen';
import LogsScreen from '../../../../apps/repository/js/logs/LogsScreen';
import {ProgressTracker} from 'polar-shared/src/util/ProgressTracker';
import {RepoDocMetas} from '../../../../apps/repository/js/RepoDocMetas';
import {LoadExampleDocs} from './onboarding/LoadExampleDocs';
import {LocalPrefs} from '../../util/LocalPrefs';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import Input from 'reactstrap/lib/Input';
import {Splashes} from '../../../../apps/repository/js/splash2/Splashes';
import {PremiumScreen} from '../../../../apps/repository/js/splash/splashes/premium/PremiumScreen';
import {Accounts} from '../../accounts/Accounts';
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
import {LoadingSplash} from "../../ui/loading_splash/LoadingSplash";
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
import {App, AppInitializer} from "./AppInitializer";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import {useState} from "react";
import Container from "@material-ui/core/Container";

const log = Logger.create();

export class RepositoryApp {

    constructor(private readonly persistenceLayerManager = new PersistenceLayerManager(),
                private readonly repoDocMetaManager = new RepoDocMetaManager(persistenceLayerManager),
                private readonly repoDocMetaLoader = new RepoDocMetaLoader(persistenceLayerManager)) {
    }

    public async start() {

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        const persistenceLayerManager = this.persistenceLayerManager;

        const app = await AppInitializer.init({
            persistenceLayerManager,

            onNeedsAuthentication: async (app: App) => {

                new FileImportController(() => app.persistenceLayerManager.get(), updatedDocInfoEventDispatcher)
                    .start();

                new DocRepoAnkiSyncController(app.persistenceLayerManager, app.syncBarProgress)
                    .start();

                await this.doLoadExampleDocs(app);

                updatedDocInfoEventDispatcher.addEventListener(docInfo => {
                    this.onUpdatedDocInfo(app, docInfo);
                });

                app.persistenceLayerManager.addEventListener(event => {

                    if (event.state === 'changed') {
                        event.persistenceLayer.addEventListener((persistenceLayerEvent: PersistenceLayerEvent) => {


                            this.onUpdatedDocInfo(app, persistenceLayerEvent.docInfo);

                        });
                    }

                });

            }

        });

        const renderDocRepoScreen = () => {

            return (
                <Cached>
                    <AuthRequired authStatus={app.authStatus}>
                        <PersistenceLayerApp repoDocMetaManager={this.repoDocMetaManager}
                                             repoDocMetaLoader={this.repoDocMetaLoader}
                                             persistenceLayerManager={persistenceLayerManager}
                                             render={(docRepo) =>
                            <DocRepoScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                           persistenceLayerController={app.persistenceLayerController}
                                           tags={docRepo.docTags}
                                           docRepo={docRepo}
                                           updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                                           repoDocMetaManager={this.repoDocMetaManager}
                                           repoDocMetaLoader={this.repoDocMetaLoader}/>
                        }/>
                    </AuthRequired>
                </Cached>
            );
        };

        const renderSettingsScreen = () => (
            <Cached>
                <SettingsScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                persistenceLayerController={app.persistenceLayerController}/>
            </Cached>
            );

        const renderProfileScreen = () => (
            <Cached>
                <ProfileScreen persistenceLayerProvider={app.persistenceLayerProvider}
                               persistenceLayerController={app.persistenceLayerController}/>
            </Cached>
        );

        const renderDeviceScreen = () => (
            <Cached>
                <DeviceScreen persistenceLayerProvider={app.persistenceLayerProvider}
                              persistenceLayerController={app.persistenceLayerController}/>
            </Cached>
        );

        const renderAnnotationRepoScreen = () => {
            return (
                <Cached>
                    <AuthRequired authStatus={app.authStatus}>
                        <PersistenceLayerApp repoDocMetaManager={this.repoDocMetaManager}
                                             repoDocMetaLoader={this.repoDocMetaLoader}
                                             persistenceLayerManager={persistenceLayerManager}
                                             render={(props) =>
                            <AnnotationRepoScreen persistenceLayerManager={persistenceLayerManager}
                                                  persistenceLayerProvider={app.persistenceLayerProvider}
                                                  tags={props.annotationTags}
                                                  updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                                                  repoDocMetaManager={this.repoDocMetaManager}
                                                  repoDocMetaLoader={this.repoDocMetaLoader}
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
                             repoDocMetaManager={this.repoDocMetaManager}/>
            </AuthRequired>
        );

        const renderLogsScreen = () => {
            return (
                <AuthRequired authStatus={app.authStatus}>
                    <LogsScreen persistenceLayerProvider={app.persistenceLayerProvider}
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
                    <CreateGroupScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                       persistenceLayerController={app.persistenceLayerController}
                                       repoDocMetaManager={this.repoDocMetaManager}/>
                </AuthRequired>
            );
        };

        const plan = app.account ? app.account.plan : 'free';

        const premiumScreen = () => {
            return (<PremiumScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                   persistenceLayerController={app.persistenceLayerController}
                                   plan={plan}
                                   userInfo={app.userInfo}/>);
        };

        const premiumScreenYear = () => {
            return (<PremiumScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                   persistenceLayerController={app.persistenceLayerController}
                                   plan={plan}
                                   interval='year'
                                   userInfo={app.userInfo}/>);
        };

        const supportScreen = () => {
            return (<SupportScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                   persistenceLayerController={app.persistenceLayerController}
                                   plan={plan}/>);
        };

        const renderGroupScreen = () => {
            return (<GroupScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                 persistenceLayerController={app.persistenceLayerController}/>);
        };

        const renderGroupsScreen = () => {
            return (<GroupsScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                  persistenceLayerController={app.persistenceLayerController}/>);
        };

        const renderGroupHighlightsScreen = () => {
            return (<HighlightsScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                      persistenceLayerController={app.persistenceLayerController}/>);
        };

        const renderGroupHighlightScreen = () => {
            return (<GroupHighlightScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                          persistenceLayerController={app.persistenceLayerController}/>);
        };

        const renderInvite = () => {
            return <InviteScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                 persistenceLayerController={app.persistenceLayerController}
                                 plan={app.account?.plan}/>;
        };

        Accounts.listenForPlanUpgrades()
            .catch(err => log.error("Unable to listen for plan upgrades: ", err));

        // TODO: splashes renders far far far too late and there's a delay.

        const rootElement = getRootElement();

        const theme: any = {
            typography: {
                htmlFontSize: 12,
                fontSize: 12
            },
            palette: {
                type: "light"
            }
        };

        const muiTheme = createMuiTheme(theme);

        //     // <Container component="main" maxWidth={false} disableGutters>

        ReactDOM.render([
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline/>

                <Splashes key="splashes" persistenceLayerManager={persistenceLayerManager}/>

                <SyncBar key="sync-bar" progress={app.syncBarProgress}/>

                <>

                    <BrowserRouter key="browser-router">

                        <Switch location={ReactRouters.createLocationWithPathAndHash()}>

                        </Switch>

                    </BrowserRouter>

                    <BrowserRouter key="path-router">

                        <Switch location={ReactRouters.createLocationWithPathOnly()}>

                            <Route exact path='/logs' render={renderLogsScreen}/>

                            <Route exact path='/whats-new' render={renderWhatsNewScreen} />

                            <Route path='/group/:group/highlights' render={renderGroupHighlightsScreen}/>

                            <Route path='/group/:group/docs' render={renderGroupScreen}/>

                            <Route path='/group/:group/highlight/:id' render={renderGroupHighlightScreen}/>

                            <Route path='/group/:group' render={renderGroupHighlightsScreen}/>

                            <Route exact path='/groups' render={renderGroupsScreen}/>

                            <Route exact path='/groups/create' render={renderCreateGroupScreen}/>

                            <Route exact path='/invite' render={renderInvite}/>

                            <Route exact path='/plans' render={premiumScreen}/>

                            <Route exact path='/plans-year' render={premiumScreenYear}/>

                            <Route exact path='/ui-components' render={() => <UIComponentsScreen persistenceLayerManager={persistenceLayerManager}
                                                                                                 persistenceLayerProvider={app.persistenceLayerProvider}/>} />

                            <Route exact path='/premium' render={premiumScreen}/>

                            <Route exact path='/support' render={supportScreen}/>

                            <Route exact path='/stats' component={renderStatsScreen}/>

                            <Route exact path="/annotations" component={renderAnnotationRepoScreen} />

                            <Route exact path="/settings" component={renderSettingsScreen} />

                            <Route exact path="/profile" component={renderProfileScreen} />

                            <Route exact path="/device" component={renderDeviceScreen} />

                            <Route exact path='/' component={renderDefaultScreenByDevice}/>

                        </Switch>

                        <Switch location={ReactRouters.createLocationWithHashOnly()}>

                            <Route path='#configured'
                                   component={() =>
                                       <Cached>
                                           <CloudSyncConfiguredModal/>
                                       </Cached>
                                   }/>

                            <Route path='#account'
                                   component={() =>
                                       <Cached>
                                           <AccountControlSidebar persistenceLayerProvider={app.persistenceLayerProvider}
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
                       onChange={() => this.onFileUpload()}
                       style={{
                           width: 0,
                           height: 0,
                           opacity: 0
                       }}/>

                </MuiThemeProvider>
                // </Container>


            ],

            rootElement

        );

        // TODO: return authStatus as an object and then do authState.authenticated
        // and unauthenticated so that if statements are cleaner
        if (app.authStatus !== 'needs-authentication') {

            this.handleRepoDocInfoEvents();

            await this.repoDocMetaLoader.start();

            new CloudService(persistenceLayerManager)
                .start();

            await persistenceLayerManager.start();

            log.info("Started repo doc loader.");

        }

        AppInstance.notifyStarted('RepositoryApp');

    }

    private onFileUpload() {
        console.log("File uploaded and sending event via postMessage");
        window.postMessage({type: 'file-uploaded'}, '*');
    }

    private handleRepoDocInfoEvents() {

        this.repoDocMetaLoader.addEventListener(event => {

            for (const mutation of event.mutations) {

                if (mutation.mutationType === 'created' || mutation.mutationType === 'updated') {
                    this.repoDocMetaManager.updateFromRepoDocMeta(mutation.fingerprint, mutation.repoDocMeta!);
                } else {
                    this.repoDocMetaManager.updateFromRepoDocMeta(mutation.fingerprint, undefined);
                }

            }

        });

    }

    private async doLoadExampleDocs(app: App) {

        const doLoad = async () => {

            // TODO: also use system prefs for this too.

            await LocalPrefs.markOnceExecuted(LifecycleEvents.HAS_EXAMPLE_DOCS, async () => {

                // load the example docs in the store.. on the first load we
                // should probably make sure this doesn't happen more than once
                // as the user could just delete all the files in their repo.
                // await new
                const loadExampleDocs = new LoadExampleDocs(app.persistenceLayerManager.get());
                await loadExampleDocs.load(docInfo => {
                    this.onUpdatedDocInfo(app, docInfo);
                });

            }, async () => {
                log.debug("Docs already exist in repo");
            });

        };

        app.persistenceLayerManager.addEventListener(event => {

            if (event.state === 'initialized') {

                doLoad()
                    .catch(err => log.error("Unable to load example docs: ", err));

            }

        });

    }

    /**
     * Handle DocInfo updates sent from viewers.
     */
    private onUpdatedDocInfo(app: App,
                             docInfo: IDocInfo): void {

        const persistenceLayerProvider = () => app.persistenceLayerManager.get();

        const handleUpdatedDocInfo = async () => {

            log.info("Received DocInfo update");

            const persistenceLayer = app.persistenceLayerManager.get();
            const docMeta = await persistenceLayer.getDocMeta(docInfo.fingerprint);

            if (! docMeta) {
                throw new Error("No DocMeta");
            }

            const repoDocMeta = RepoDocMetas.convert(persistenceLayerProvider, docInfo.fingerprint, docMeta);

            const validity = RepoDocMetas.isValid(repoDocMeta);

            if (validity === 'valid') {

                this.repoDocMetaManager.updateFromRepoDocMeta(docInfo.fingerprint, repoDocMeta);

                const progress = new ProgressTracker({total: 1, id: 'doc-info-update'}).terminate();

                this.repoDocMetaLoader.dispatchEvent({
                     mutations: [
                         {
                             mutationType: 'created',
                             fingerprint: docInfo.fingerprint,
                             repoDocMeta
                         }
                     ],
                     progress
                 });

                // TODO: technically I don't think we need to test if we're
                // using the cloud layer anymore as synchronizeDocs is a noop
                // in all other datastores.
                const persistenceLayer: PersistenceLayer = app.persistenceLayerManager.get();

                if (PersistenceLayerTypes.get() === 'cloud') {

                    const handleWriteDocMeta = async () => {
                        await persistenceLayer.synchronizeDocs({
                            fingerprint: docInfo.fingerprint,
                            docMetaProvider: () => Promise.resolve(docMeta)
                        });
                    };

                    handleWriteDocMeta()
                        .catch(err => log.error("Unable to write docMeta to datastore: ", err));

                }

            } else {

                log.warn(`We were given an invalid DocInfo which yielded a broken RepoDocMeta ${validity}: `,
                         docInfo, repoDocMeta);

            }

        };

        handleUpdatedDocInfo()
            .catch(err => log.error("Unable to update doc info with fingerprint: " + docInfo.fingerprint, err));

    }

}

function getRootElement() {

    const rootElement = document.getElementById('root') as HTMLElement;

    if (! rootElement) {
        throw new Error("No root element to which to render");
    }

    return rootElement;

}

function renderLoadingSplash() {

    const rootElement = getRootElement();

    ReactDOM.render(<LoadingSplash/>, rootElement);

}
