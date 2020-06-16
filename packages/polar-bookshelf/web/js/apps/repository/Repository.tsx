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
import {DocRepoAnkiSyncController} from '../../controller/DocRepoAnkiSyncController';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PersistenceLayerEvent} from '../../datastore/PersistenceLayerEvent';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import {ProgressTracker} from 'polar-shared/src/util/ProgressTracker';
import {RepoDocMetas} from '../../../../apps/repository/js/RepoDocMetas';
import {Accounts} from '../../accounts/Accounts';
import {App, AppInitializer} from "./AppInitializer";
import {RepositoryApp} from './RepositoryApp';
import { Tracer } from 'polar-shared/src/util/Tracer';
import {AuthHandlers} from "./auth_handler/AuthHandler";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";

const log = Logger.create();

export class Repository {

    constructor(private readonly persistenceLayerManager = new PersistenceLayerManager(),
                private readonly repoDocMetaManager = new RepoDocMetaManager(persistenceLayerManager),
                private readonly repoDocMetaLoader = new RepoDocMetaLoader(persistenceLayerManager)) {
    }

    public async start() {

        console.log("Starting repository with app runtime: " + AppRuntime.get());

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        const persistenceLayerManager = this.persistenceLayerManager;

        const app = await AppInitializer.init({
            persistenceLayerManager,

            onNeedsAuthentication: async (app: App) => {

                // FIXME: refactor this so that the rest of the app continues to load and
                // this would allow us to run from cache.

                new FileImportController(() => app.persistenceLayerManager.get(), updatedDocInfoEventDispatcher)
                    .start();

                new DocRepoAnkiSyncController(app.persistenceLayerManager, app.syncBarProgress)
                    .start();

                // await this.doLoadExampleDocs(app);

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

        Accounts.listenForPlanUpgrades()
            .catch(err => log.error("Unable to listen for plan upgrades: ", err));

        // TODO: splashes renders far far far too late and there's a delay.

        const rootElement = getRootElement();

        ReactDOM.render(
            <RepositoryApp app={app}
                           persistenceLayerManager={persistenceLayerManager}
                           repoDocMetaManager={this.repoDocMetaManager}
                           repoDocMetaLoader={this.repoDocMetaLoader}
                           updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                           onFileUpload={this.onFileUpload}/>
            ,
            rootElement
        );

        const handleAuth = async () => {

            const authHandler = AuthHandlers.get();
            const authStatus = await Tracer.async(authHandler.status(), 'auth-handler');

            // TODO: return authStatus as an object and then do authState.authenticated
            // and unauthenticated so that if statements are cleaner
            if (authStatus !== 'needs-authentication') {

                this.handleRepoDocInfoEvents();

                await this.repoDocMetaLoader.start();

                // new CloudService(persistenceLayerManager)
                //     .start();

                await persistenceLayerManager.start();

                log.info("Started repo doc loader.");

            }

        }

        handleAuth()
            .catch(err => log.error("Could not handle auth: ", err));

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

            // await LocalPrefs.markOnceExecuted(LifecycleEvents.HAS_EXAMPLE_DOCS, async () => {
            //
            //     // load the example docs in the store.. on the first load we
            //     // should probably make sure this doesn't happen more than once
            //     // as the user could just delete all the files in their repo.
            //     // await new
            //     const loadExampleDocs = new LoadExampleDocs(app.persistenceLayerManager.get());
            //     await loadExampleDocs.load(docInfo => {
            //         this.onUpdatedDocInfo(app, docInfo);
            //     });
            //
            // }, async () => {
            //     log.debug("Docs already exist in repo");
            // });

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

