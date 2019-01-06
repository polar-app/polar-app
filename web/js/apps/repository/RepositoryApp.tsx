import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {RemotePersistenceLayerFactory} from '../../datastore/factories/RemotePersistenceLayerFactory';
import {FileImportController} from './FileImportController';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {IDocInfo} from '../../metadata/DocInfo';
import {AppInstance} from '../../electron/framework/AppInstance';
import {PersistenceLayers} from '../../datastore/PersistenceLayers';
import {PersistenceLayerManager, PersistenceLayerTypes} from '../../datastore/PersistenceLayerManager';
import {HashRouter, Switch, Route} from 'react-router-dom';
import {PrioritizedSplashes} from '../../../../apps/repository/js/splash/PrioritizedSplashes';
import {SyncBar, SyncBarProgress} from '../../ui/sync_bar/SyncBar';
import {DocRepoAnkiSyncController} from '../../controller/DocRepoAnkiSyncController';
import DocRepoApp from '../../../../apps/repository/js/doc_repo/DocRepoApp';
import AnnotationRepoApp from '../../../../apps/repository/js/annotation_repo/AnnotationRepoApp';
import {RepoDocInfos} from '../../../../apps/repository/js/RepoDocInfos';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {Logger} from '../../logger/Logger';
import {AutoUpdatesController} from '../../auto_updates/AutoUpdatesController';
import {PersistenceLayerEvent} from '../../datastore/PersistenceLayerEvent';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {CloudService} from '../../../../apps/repository/js/cloud/CloudService';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import {Throttler} from '../../datastore/Throttler';
import {WhatsNewContent} from '../../../../apps/repository/js/splash/splashes/whats_new/WhatsNewContent';
import WhatsNewApp from '../../../../apps/repository/js/whats_new/WhatsNewApp';
import CommunityApp from '../../../../apps/repository/js/community/CommunityApp';
import StatsApp from '../../../../apps/repository/js/stats/StatsApp';
import LogsApp from '../../../../apps/repository/js/logs/LogsApp';
import {ToasterService} from '../../ui/toaster/ToasterService';

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

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        const syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

        new FileImportController(this.persistenceLayerManager, updatedDocInfoEventDispatcher)
            .start();

        new DocRepoAnkiSyncController(this.persistenceLayerManager, syncBarProgress)
            .start();

        new AutoUpdatesController().start();

        new CloudService(this.persistenceLayerManager)
            .start();

        new ToasterService().start();

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
            return ( <WhatsNewApp/> );
        };

        const renderCommunity = () => {
            return ( <CommunityApp/> );
        };

        const renderStats = () => {
            return ( <StatsApp repoDocMetaManager={this.repoDocInfoManager}/> );
        };

        const renderLogs = () => {
            return ( <LogsApp /> );
        };

        ReactDOM.render(

            <div>

                <PrioritizedSplashes/>

                <SyncBar progress={syncBarProgress}/>

                <HashRouter hashType="noslash">

                    <Switch>
                        <Route exact path='/(logout|overview|login|configured|invite)?' render={renderDocRepoApp}/>
                        <Route exact path='/annotations' render={renderAnnotationRepoApp}/>
                        <Route exact path='/whats-new' render={renderWhatsNew}/>
                        <Route exact path='/community' render={renderCommunity}/>
                        <Route exact path='/stats' render={renderStats}/>
                        <Route exact path='/logs' render={renderLogs}/>
                    </Switch>

                </HashRouter>

            </div>,

            document.getElementById('root') as HTMLElement

        );

        this.handleRepoDocInfoEvents();

        await this.repoDocInfoLoader.start();

        await this.persistenceLayerManager.start();

        AppInstance.notifyStarted('RepositoryApp');

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

    /**
     * Handle DocInfo updates sent from viewers.
     */
    private onUpdatedDocInfo(docInfo: IDocInfo): void {

        log.info("Received DocInfo update");

        const repoDocInfo = RepoDocInfos.convert(docInfo);

        if (RepoDocInfos.isValid(repoDocInfo)) {

            this.repoDocInfoManager.updateFromRepoDocInfo(repoDocInfo.fingerprint, repoDocInfo);

            // TODO: technically I don't think we need to test if we're using
            // the cloud layer anymore as synchronizeDocs is a noop in all other
            // datastores.
            const persistenceLayer: PersistenceLayer = this.persistenceLayerManager.get();

            if (PersistenceLayerTypes.get() === 'cloud') {

                const handleWriteDocMeta = async () => {
                    await persistenceLayer.synchronizeDocs(docInfo.fingerprint);
                };

                handleWriteDocMeta()
                    .catch(err => log.error("Unable to write docMeta to datastore: ", err));

            }

        } else {

            log.warn("We were given an invalid DocInfo which yielded a broken RepoDocInfo: ",
                     docInfo, repoDocInfo);

        }

    }

}
