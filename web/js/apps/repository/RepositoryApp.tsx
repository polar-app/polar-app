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
import {SyncBar, SyncBarProgress} from '../../ui/sync_bar/SyncBar';
import {DocRepoAnkiSyncController} from '../../controller/DocRepoAnkiSyncController';
import AnnotationRepoScreen
    from '../../../../apps/repository/js/annotation_repo/AnnotationRepoScreen';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {UpdatesController} from '../../auto_updates/UpdatesController';
import {PersistenceLayerEvent} from '../../datastore/PersistenceLayerEvent';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {CloudService} from '../../../../apps/repository/js/cloud/CloudService';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import WhatsNewScreen
    from '../../../../apps/repository/js/whats_new/WhatsNewScreen';
import StatsScreen from '../../../../apps/repository/js/stats/StatsScreen';
import LogsScreen from '../../../../apps/repository/js/logs/LogsScreen';
import {ToasterService} from '../../ui/toaster/ToasterService';
import {ProgressService} from '../../ui/progress_bar/ProgressService';
import {ProgressTracker} from 'polar-shared/src/util/ProgressTracker';
import {RepoDocMetas} from '../../../../apps/repository/js/RepoDocMetas';
import {Version} from 'polar-shared/src/util/Version';
import {LoadExampleDocs} from './onboarding/LoadExampleDocs';
import {LocalPrefs} from '../../util/LocalPrefs';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {Platforms} from 'polar-shared/src/util/Platforms';
import {AppOrigin} from '../AppOrigin';
import {AuthHandlers} from './auth_handler/AuthHandler';
import Input from 'reactstrap/lib/Input';
import {Splashes} from '../../../../apps/repository/js/splash2/Splashes';
import {MachineDatastores} from '../../telemetry/MachineDatastores';
import {MailingList} from './auth_handler/MailingList';
import {UniqueMachines} from '../../telemetry/UniqueMachines';
import {PremiumScreen} from '../../../../apps/repository/js/splash/splashes/premium/PremiumScreen';
import {Accounts} from '../../accounts/Accounts';
import {SupportScreen} from '../../../../apps/repository/js/support/SupportScreen';
import DocRepoScreen
    from '../../../../apps/repository/js/doc_repo/DocRepoScreen';
import {CreateGroupScreen} from "../../../../apps/repository/js/groups/create/CreateGroupScreen";
import {GroupsScreen} from "../../../../apps/repository/js/groups/GroupsScreen";
import {GroupScreen} from "../../../../apps/repository/js/group/GroupScreen";
import {AuthRequired} from "../../../../apps/repository/js/AuthRequired";
import {UIModes} from "../../ui/uimodes/UIModes";
import {HighlightsScreen} from "../../../../apps/repository/js/group/highlights/HighlightsScreen";
import {GroupHighlightScreen} from "../../../../apps/repository/js/group/highlight/GroupHighlightScreen";
import {PrefetchedUserGroupsBackgroundListener} from "../../datastore/sharing/db/PrefetchedUserGroupsBackgroundListener";
import {PlatformStyles} from "../../ui/PlatformStyles";
import {PDFModernTextLayers} from "polar-pdf/src/pdf/PDFModernTextLayers";
import {AccountProvider} from "../../accounts/AccountProvider";
import {PersistenceLayerApp} from "../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {UIComponentsScreen} from "../../../../apps/repository/js/ui-components/UIComponentsScreen";
import {LoadingSplash} from "../../ui/loading_splash/LoadingSplash";
import {InviteScreen} from "../../../../apps/repository/js/invite/InviteScreen";
import {AccountControlSidebar} from "../../../../apps/repository/js/AccountControlSidebar";
import {ReactRouters} from "../../react/router/ReactRouters";
import {Cached} from '../../react/Cached';
import {ExternalNavigationBlock} from "../../electron/navigation/ExternalNavigationBlock";
import {CloudSyncConfiguredModal} from "../../ui/cloud_auth/CloudSyncConfiguredModal";
import {SettingsScreen} from "../../../../apps/repository/js/settings/SettingsScreen";
import {DeviceRouter} from "../../ui/DeviceRouter";
import {FeatureToggleRouter} from "../../ui/FeatureToggleRouter";
import {DeviceScreen} from "../../../../apps/repository/js/device/DeviceScreen";
import {PinchToZoom} from "../../ui/Gestures";
import {AnalyticsInitializer} from "../../analytics/AnalyticsInitializer";

const log = Logger.create();

export class RepositoryApp {

    private readonly persistenceLayerManager = new PersistenceLayerManager();
    private readonly repoDocInfoManager: RepoDocMetaManager;
    private readonly repoDocInfoLoader: RepoDocMetaLoader;

    constructor() {
        this.repoDocInfoManager = new RepoDocMetaManager(this.persistenceLayerManager);
        this.repoDocInfoLoader = new RepoDocMetaLoader(this.persistenceLayerManager);
    }

    public async start() {

        log.info("Running with Polar version: " + Version.get());

        AnalyticsInitializer.doInit();

        renderLoadingSplash();

        PinchToZoom.disable();

        // enable the navigation block.  This enables it by default and then turns
        // it on again after login is completed.
        ExternalNavigationBlock.set(true);

        const persistenceLayerProvider = () => this.persistenceLayerManager.get();
        const persistenceLayerController = this.persistenceLayerManager;

        UIModes.register();
        PlatformStyles.assign();

        AppOrigin.configure();

        PDFModernTextLayers.configure();

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        const syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

        const authHandler = AuthHandlers.get();

        const authStatus = await authHandler.status();

        const account = await Accounts.get();
        await AccountProvider.init(account);
        const userInfo = await authHandler.userInfo();

        const platform = Platforms.get();

        log.notice("Running on platform: " + Platforms.toSymbol(platform));

        if (authStatus !== 'needs-authentication') {

            // subscribe but do it in the background as this isn't a high priority UI task.
            MailingList.subscribeWhenNecessary()
                .catch(err => log.error(err));

            new FileImportController(() => this.persistenceLayerManager.get(), updatedDocInfoEventDispatcher)
                .start();

            new DocRepoAnkiSyncController(this.persistenceLayerManager, syncBarProgress)
                .start();

            new UpdatesController().start();

            new ToasterService().start();

            new ProgressService().start();

            await PrefetchedUserGroupsBackgroundListener.start();

            await this.doLoadExampleDocs();

            MachineDatastores.triggerBackgroundUpdates(this.persistenceLayerManager);

            UniqueMachines.trigger();

            // PreviewDisclaimers.createWhenNecessary();

            // MobileDisclaimers.createWhenNecessary();

            updatedDocInfoEventDispatcher.addEventListener(docInfo => {
                this.onUpdatedDocInfo(docInfo);
            });

            this.persistenceLayerManager.addEventListener(event => {

                if (event.state === 'changed') {
                    event.persistenceLayer.addEventListener((persistenceLayerEvent: PersistenceLayerEvent) => {

                        this.onUpdatedDocInfo(persistenceLayerEvent.docInfo);

                    });
                }

            });

        }

        const renderDocRepoScreen = () => {

            return (
                <Cached>
                    <AuthRequired authStatus={authStatus}>
                        <PersistenceLayerApp repoDocMetaManager={this.repoDocInfoManager}
                                             repoDocMetaLoader={this.repoDocInfoLoader}
                                             persistenceLayerManager={this.persistenceLayerManager}
                                             render={(docRepo) =>
                            <DocRepoScreen persistenceLayerProvider={persistenceLayerProvider}
                                           persistenceLayerController={persistenceLayerController}
                                           tags={docRepo.docTags}
                                           docRepo={docRepo}
                                           updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                                           repoDocMetaManager={this.repoDocInfoManager}
                                           repoDocMetaLoader={this.repoDocInfoLoader}/>
                        }/>
                    </AuthRequired>
                </Cached>
            );
        };

        const renderSettingsScreen = () => (
            <Cached>
                <SettingsScreen persistenceLayerProvider={persistenceLayerProvider}
                                persistenceLayerController={persistenceLayerController}/>
            </Cached>
            );

        const renderDeviceScreen = () => (
            <Cached>
                <DeviceScreen persistenceLayerProvider={persistenceLayerProvider}
                              persistenceLayerController={persistenceLayerController}/>
            </Cached>
        );

        const renderAnnotationRepoScreen = () => {
            return (
                <Cached>
                    <AuthRequired authStatus={authStatus}>
                        <PersistenceLayerApp repoDocMetaManager={this.repoDocInfoManager}
                                             repoDocMetaLoader={this.repoDocInfoLoader}
                                             persistenceLayerManager={this.persistenceLayerManager}
                                             render={(props) =>
                            <AnnotationRepoScreen persistenceLayerManager={this.persistenceLayerManager}
                                                  persistenceLayerProvider={persistenceLayerProvider}
                                                  tags={props.annotationTags}
                                                  updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                                                  repoDocMetaManager={this.repoDocInfoManager}
                                                  repoDocMetaLoader={this.repoDocInfoLoader}
                                                  syncBarProgress={syncBarProgress}/>
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
            <WhatsNewScreen persistenceLayerProvider={persistenceLayerProvider}
                             persistenceLayerController={persistenceLayerController}/>
        );

        // const renderCommunityScreen = () => (
        //     <AuthRequired authStatus={authStatus}>
        //         <CommunityScreen persistenceLayerProvider={persistenceLayerProvider}
        //                          persistenceLayerController={persistenceLayerController}/>
        //     </AuthRequired>
        // );

        const renderStatsScreen = () => (
            <AuthRequired authStatus={authStatus}>
                <StatsScreen persistenceLayerProvider={persistenceLayerProvider}
                             persistenceLayerController={persistenceLayerController}
                             repoDocMetaManager={this.repoDocInfoManager}/>
            </AuthRequired>
        );

        const renderLogsScreen = () => {
            return (
                <AuthRequired authStatus={authStatus}>
                    <LogsScreen persistenceLayerProvider={persistenceLayerProvider}
                                persistenceLayerController={persistenceLayerController}/>
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
                <AuthRequired authStatus={authStatus}>
                    <CreateGroupScreen persistenceLayerProvider={persistenceLayerProvider}
                                       persistenceLayerController={persistenceLayerController}
                                       repoDocMetaManager={this.repoDocInfoManager}/>
                </AuthRequired>
            );
        };

        const plan = account ? account.plan : 'free';

        const premiumScreen = () => {
            return (<PremiumScreen persistenceLayerProvider={persistenceLayerProvider}
                                   persistenceLayerController={persistenceLayerController}
                                   plan={plan}
                                   userInfo={userInfo.getOrUndefined()}/>);
        };

        const premiumScreenYear = () => {
            return (<PremiumScreen persistenceLayerProvider={persistenceLayerProvider}
                                   persistenceLayerController={persistenceLayerController}
                                   plan={plan}
                                   interval='year'
                                   userInfo={userInfo.getOrUndefined()}/>);
        };

        const supportScreen = () => {
            return (<SupportScreen persistenceLayerProvider={persistenceLayerProvider}
                                   persistenceLayerController={persistenceLayerController}
                                   plan={plan}/>);
        };

        const renderGroupScreen = () => {
            return (<GroupScreen persistenceLayerProvider={persistenceLayerProvider}
                                 persistenceLayerController={persistenceLayerController}/>);
        };

        const renderGroupsScreen = () => {
            return (<GroupsScreen persistenceLayerProvider={persistenceLayerProvider}
                                  persistenceLayerController={persistenceLayerController}/>);
        };

        const renderGroupHighlightsScreen = () => {
            return (<HighlightsScreen persistenceLayerProvider={persistenceLayerProvider}
                                      persistenceLayerController={persistenceLayerController}/>);
        };

        const renderGroupHighlightScreen = () => {
            return (<GroupHighlightScreen persistenceLayerProvider={persistenceLayerProvider}
                                          persistenceLayerController={persistenceLayerController}/>);
        };

        const renderInvite = () => {
            return <InviteScreen persistenceLayerProvider={persistenceLayerProvider}
                                 persistenceLayerController={persistenceLayerController}
                                 plan={account?.plan}/>;
        };

        Accounts.listenForPlanUpgrades()
            .catch(err => log.error("Unable to listen for plan upgrades: ", err));

        // TODO: splashes renders far far far too late and there's a delay.

        const rootElement = getRootElement();

        ReactDOM.render([

                <Splashes key="splashes" persistenceLayerManager={this.persistenceLayerManager}/>,

                <SyncBar key="sync-bar" progress={syncBarProgress}/>,

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

                            <Route exact path='/ui-components' render={() => <UIComponentsScreen persistenceLayerManager={this.persistenceLayerManager}
                                                                                                 persistenceLayerProvider={persistenceLayerProvider}/>} />

                            <Route exact path='/premium' render={premiumScreen}/>

                            <Route exact path='/support' render={supportScreen}/>

                            <Route exact path='/stats' component={renderStatsScreen}/>

                            <Route exact path="/annotations" component={renderAnnotationRepoScreen} />

                            <Route exact path="/settings" component={renderSettingsScreen} />

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
                                           <AccountControlSidebar persistenceLayerProvider={persistenceLayerProvider}
                                                                  persistenceLayerController={persistenceLayerController}/>
                                       </Cached>
                                   }/>

                            {/*TODO: add a logout splash so that the user knows that they are unauthenticated.*/}
                            <Route path='#logout'
                                   render={() => (
                                       <div></div>
                                   )}/>

                        </Switch>

                    </BrowserRouter>

                </>,

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

            ],

            rootElement

        );

        // TODO: return authStatus as an object and then do authState.authenticated
        // and unauthenticated so that if statements are cleaner
        if (authStatus !== 'needs-authentication') {

            this.handleRepoDocInfoEvents();

            await this.repoDocInfoLoader.start();

            new CloudService(this.persistenceLayerManager)
                .start();

            await this.persistenceLayerManager.start();

            log.info("Started repo doc loader.");

        }

        AppInstance.notifyStarted('RepositoryApp');

    }

    private onFileUpload() {
        console.log("File uploaded and sending event via postMessage");
        window.postMessage({type: 'file-uploaded'}, '*');
    }

    private handleRepoDocInfoEvents() {

        this.repoDocInfoLoader.addEventListener(event => {

            for (const mutation of event.mutations) {

                if (mutation.mutationType === 'created' || mutation.mutationType === 'updated') {
                    this.repoDocInfoManager.updateFromRepoDocMeta(mutation.fingerprint, mutation.repoDocMeta!);
                } else {
                    this.repoDocInfoManager.updateFromRepoDocMeta(mutation.fingerprint);
                }

            }

        });

    }

    private async doLoadExampleDocs() {

        const doLoad = async () => {

            // TODO: also use system prefs for this too.

            await LocalPrefs.markOnceExecuted(LifecycleEvents.HAS_EXAMPLE_DOCS, async () => {

                // load the example docs in the store.. on the first load we
                // should probably make sure this doesn't happen more than once
                // as the user could just delete all the files in their repo.
                // await new
                const loadExampleDocs = new LoadExampleDocs(this.persistenceLayerManager.get());
                await loadExampleDocs.load(docInfo => {
                    this.onUpdatedDocInfo(docInfo);
                });

            }, async () => {
                log.debug("Docs already exist in repo");
            });

        };

        this.persistenceLayerManager.addEventListener(event => {

            if (event.state === 'initialized') {

                doLoad()
                    .catch(err => log.error("Unable to load example docs: ", err));

            }

        });

    }

    /**
     * Handle DocInfo updates sent from viewers.
     */
    private onUpdatedDocInfo(docInfo: IDocInfo): void {

        const persistenceLayerProvider = () => this.persistenceLayerManager.get();

        const handleUpdatedDocInfo = async () => {

            log.info("Received DocInfo update");

            const persistenceLayer = this.persistenceLayerManager.get();
            const docMeta = await persistenceLayer.getDocMeta(docInfo.fingerprint);

            if (! docMeta) {
                throw new Error("No DocMeta");
            }

            const repoDocMeta = RepoDocMetas.convert(persistenceLayerProvider, docInfo.fingerprint, docMeta);

            const validity = RepoDocMetas.isValid(repoDocMeta);

            if (validity === 'valid') {

                this.repoDocInfoManager.updateFromRepoDocMeta(docInfo.fingerprint, repoDocMeta);

                const progress = new ProgressTracker({total: 1, id: 'doc-info-update'}).terminate();

                this.repoDocInfoLoader.dispatchEvent({
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
                const persistenceLayer: PersistenceLayer = this.persistenceLayerManager.get();

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
        throw new Error("No root element to render to");
    }

    return rootElement;

}

function renderLoadingSplash() {

    const rootElement = getRootElement();

    ReactDOM.render(<LoadingSplash/>, rootElement);

}
