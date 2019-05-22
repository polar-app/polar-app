import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {FileImportController} from './FileImportController';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {IDocInfo} from '../../metadata/DocInfo';
import {AppInstance} from '../../electron/framework/AppInstance';
import {PersistenceLayerManager, PersistenceLayerTypes} from '../../datastore/PersistenceLayerManager';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {PrioritizedSplashes} from '../../../../apps/repository/js/splash/PrioritizedSplashes';
import {SyncBar, SyncBarProgress} from '../../ui/sync_bar/SyncBar';
import {DocRepoAnkiSyncController} from '../../controller/DocRepoAnkiSyncController';
import DocRepoApp from '../../../../apps/repository/js/doc_repo/DocRepoApp';
import AnnotationRepoApp from '../../../../apps/repository/js/annotation_repo/AnnotationRepoApp';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {Logger} from '../../logger/Logger';
import {UpdatesController} from '../../auto_updates/UpdatesController';
import {PersistenceLayerEvent} from '../../datastore/PersistenceLayerEvent';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {CloudService} from '../../../../apps/repository/js/cloud/CloudService';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import WhatsNewApp from '../../../../apps/repository/js/whats_new/WhatsNewApp';
import CommunityApp from '../../../../apps/repository/js/community/CommunityApp';
import StatsApp from '../../../../apps/repository/js/stats/StatsApp';
import LogsApp from '../../../../apps/repository/js/logs/LogsApp';
import {ToasterService} from '../../ui/toaster/ToasterService';
import {ProgressService} from '../../ui/progress_bar/ProgressService';
import {ProgressTracker} from '../../util/ProgressTracker';
import {RepoDocMetas} from '../../../../apps/repository/js/RepoDocMetas';
import EditorsPicksApp from '../../../../apps/repository/js/editors_picks/EditorsPicksApp';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {Version} from '../../util/Version';
import {LoadExampleDocs} from './onboarding/LoadExampleDocs';
import {RepositoryTour} from './RepositoryTour';
import {LocalPrefs} from '../../util/LocalPrefs';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {Platforms} from '../../util/Platforms';
import {AppOrigin} from '../AppOrigin';
import {AppRuntime} from '../../AppRuntime';
import {AuthHandlers} from './auth_handler/AuthHandler';
import Input from 'reactstrap/lib/Input';
import {Premium} from '../../../../apps/repository/js/splash/splashes/premium/Premium';
import {Splashes} from '../../../../apps/repository/js/splash2/Splashes';
import {MobileDisclaimer} from './MobileDisclaimer';
import {MobileDisclaimers} from './MobileDisclaimers';
import {TabNav} from '../../ui/tabs/TabNav';
import {NULL_FUNCTION} from '../../util/Functions';
import {MachineDatastores} from '../../telemetry/MachineDatastores';
import {MailingList} from './auth_handler/MailingList';
import {UniqueMachines} from '../../telemetry/UniqueMachines';
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

        AppOrigin.configure();

        const authHandler = AuthHandlers.get();

        if (await authHandler.status() === 'needs-authentication') {
            await authHandler.authenticate();
            return;
        }

        // subscribe but do it in the background as this isn't a high priority UI task.
        MailingList.subscribeWhenNecessary()
            .catch(err => log.error(err));

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        const syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

        new FileImportController(this.persistenceLayerManager, updatedDocInfoEventDispatcher)
            .start();

        new DocRepoAnkiSyncController(this.persistenceLayerManager, syncBarProgress)
            .start();

        new UpdatesController().start();

        new ToasterService().start();

        new ProgressService().start();

        await this.doLoadExampleDocs();

        MachineDatastores.triggerBackgroundUpdates(this.persistenceLayerManager);

        UniqueMachines.trigger();

        // PreviewDisclaimers.createWhenNecessary();

        MobileDisclaimers.createWhenNecessary();

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

        const renderDocRepoApp = () => {
            return ( <DocRepoApp persistenceLayerManager={this.persistenceLayerManager}
                                 updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                                 repoDocMetaManager={this.repoDocInfoManager}
                                 repoDocMetaLoader={this.repoDocInfoLoader}
                                 syncBarProgress={syncBarProgress}/> );
        };

        const renderAnnotationRepoApp = () => {
            return ( <AnnotationRepoApp persistenceLayerManager={this.persistenceLayerManager}
                                        updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                                        repoDocMetaManager={this.repoDocInfoManager}
                                        repoDocMetaLoader={this.repoDocInfoLoader}
                                        syncBarProgress={syncBarProgress}/> );
        };

        const renderWhatsNew = () => {
            return ( <WhatsNewApp persistenceLayerManager={this.persistenceLayerManager}/> );
        };

        const renderCommunity = () => {
            return ( <CommunityApp persistenceLayerManager={this.persistenceLayerManager}/> );
        };

        const renderStats = () => {
            return ( <StatsApp persistenceLayerManager={this.persistenceLayerManager}
                               repoDocMetaManager={this.repoDocInfoManager}/> );
        };

        const renderLogs = () => {
            return ( <LogsApp persistenceLayerManager={this.persistenceLayerManager}/> );
        };

        const editorsPicks = () => {
            return ( <EditorsPicksApp persistenceLayerManager={this.persistenceLayerManager}/> );
        };

        const premium = () => {
            return (<Premium/>);
        };

        const onNavChange = () => {

            try {

                const url = new URL(document.location!.href);

                const path = url.pathname + url.hash || "";
                const hostname = url.hostname;
                const title = document.title;

                log.info("Navigating to: ", { path, hostname, title });

                RendererAnalytics.pageview(path, hostname, document.title);

            } catch (e) {
                log.error("Unable to handle hash change", e);
            }

        };

        // must be called the first time so that we have analytics for the home
        // page on first load.
        onNavChange();

        window.addEventListener("hashchange", () => onNavChange(), false);

        this.sendAnalytics();

        ReactDOM.render(

            <div style={{height: '100%'}}>

                {/*<PrioritizedSplashes persistenceLayerManager={this.persistenceLayerManager}/>*/}

                <Splashes persistenceLayerManager={this.persistenceLayerManager}/>

                <SyncBar progress={syncBarProgress}/>

                <RepositoryTour/>

                {/*TODO this doesn't actually work because the iframes aren't */}
                {/*expanded properly I think. */}

                {/*<TabNav addTabBinder={NULL_FUNCTION}*/}
                        {/*initialTabs={[*/}
                            {/*{*/}
                                {/*title: "Repository",*/}
                                {/*content: <div>*/}

                                    {/*<HashRouter hashType="noslash">*/}

                                        {/*<Switch>*/}
                                            {/*<Route exact path='/(logout|overview|login|configured|invite|premium)?' render={renderDocRepoApp}/>*/}
                                            {/*<Route exact path='/annotations' render={renderAnnotationRepoApp}/>*/}
                                            {/*<Route exact path='/whats-new' render={renderWhatsNew}/>*/}
                                            {/*<Route exact path='/community' render={renderCommunity}/>*/}
                                            {/*<Route exact path='/stats' render={renderStats}/>*/}
                                            {/*<Route exact path='/logs' render={renderLogs}/>*/}
                                            {/*<Route exact path='/editors-picks' render={editorsPicks}/>*/}
                                        {/*</Switch>*/}

                                    {/*</HashRouter>*/}

                                {/*</div>*/}
                            {/*},*/}
                            {/*{*/}
                                {/*title: "How to be Successful",*/}
                                {/*content: "http://localhost:8500/htmlviewer/index.html?file=http%3A%2F%2Flocalhost%3A8500%2Ffiles%2F12ftXRsX74J16Rmjwp85zhRswMstYCksLppdqCvnEeTz2Ut98ut&filename=12tTwL82eW-How_To_Be_Successful___Sam_Altman.phz&fingerprint=1TofZfqvEEcSgrNYi6Wo&zoom=page-width&strategy=portable"*/}
                            {/*}*/}
                        {/*]}/>*/}

                <HashRouter hashType="noslash">

                    <Switch>
                        <Route exact path='/(logout|overview|login|configured|invite|premium)?' render={renderDocRepoApp}/>
                        <Route exact path='/annotations' render={renderAnnotationRepoApp}/>
                        <Route exact path='/whats-new' render={renderWhatsNew}/>
                        <Route exact path='/community' render={renderCommunity}/>
                        <Route exact path='/stats' render={renderStats}/>
                        <Route exact path='/logs' render={renderLogs}/>
                        <Route exact path='/editors-picks' render={editorsPicks}/>
                    </Switch>

                </HashRouter>

                <HashRouter hashType="noslash">

                    <Switch>
                        <Route exact path='/premium' render={premium}/>
                    </Switch>

                </HashRouter>


                {/*Used for file uploads.  This has to be on the page and can't be*/}
                {/*selectively hidden by components.*/}
                <Input type="file"
                       id="file-upload"
                       name="file-upload"
                       accept=".pdf, .PDF"
                       multiple
                       onChange={() => this.onFileUpload()}
                       style={{display: 'none'}}/>

            </div>,

            document.getElementById('root') as HTMLElement

        );

        this.handleRepoDocInfoEvents();

        await this.repoDocInfoLoader.start();

        new CloudService(this.persistenceLayerManager)
            .start();

        await this.persistenceLayerManager.start();

        log.info("Started repo doc loader.");

        AppInstance.notifyStarted('RepositoryApp');

    }

    private onFileUpload() {

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

    private sendAnalytics() {

        const version = Version.get();
        const platform = Platforms.toSymbol(Platforms.get());
        const screen = `${window.screen.width}x${window.screen.height}`;
        const runtime = AppRuntime.type();

        RendererAnalytics.event({category: 'app', action: 'version-' + version});
        RendererAnalytics.event({category: 'platform', action: `${platform}`});
        RendererAnalytics.event({category: 'screen', action: screen});
        RendererAnalytics.event({category: 'runtime', action: runtime});

    }

    private async doLoadExampleDocs() {

        const doLoad = async () => {

            // TODO: also use system prefs for this too.

            await LocalPrefs.markOnceExecuted(LifecycleEvents.HAS_EXAMPLE_DOCS, async () => {

                // load the eample docs in the store.. on the first load we
                // should propably make sure this doesn't happen more than once
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

            const docMeta = await this.persistenceLayerManager.get().getDocMeta(docInfo.fingerprint);

            const repoDocMeta = RepoDocMetas.convert(persistenceLayerProvider, docInfo.fingerprint, docMeta);

            const validity = RepoDocMetas.isValid(repoDocMeta);

            if (validity === 'valid') {

                this.repoDocInfoManager.updateFromRepoDocMeta(docInfo.fingerprint, repoDocMeta);

                const progress = new ProgressTracker(1, 'doc-info-update').terminate();

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
                        await persistenceLayer.synchronizeDocs({fingerprint: docInfo.fingerprint, docMeta});
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
