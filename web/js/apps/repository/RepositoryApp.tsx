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
import {RepoDocInfoManager} from '../../../../apps/repository/js/RepoDocInfoManager';
import {CloudService} from '../../../../apps/repository/js/cloud/CloudService';
import {RepoDocInfoLoader} from '../../../../apps/repository/js/RepoDocInfoLoader';

const log = Logger.create();

export class RepositoryApp {

    private readonly persistenceLayerManager = new PersistenceLayerManager();
    private readonly repoDocInfoManager: RepoDocInfoManager;
    private readonly repoDocInfoLoader: RepoDocInfoLoader;

    constructor() {
        this.repoDocInfoManager = new RepoDocInfoManager(this.persistenceLayerManager);
        this.repoDocInfoLoader = new RepoDocInfoLoader(this.persistenceLayerManager);

    }

    public async start() {

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        const syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

        new FileImportController(this.persistenceLayerManager, updatedDocInfoEventDispatcher)
            .start();

        new DocRepoAnkiSyncController(this.persistenceLayerManager, syncBarProgress)
            .start();

        new AutoUpdatesController().start();

        // TODO: this doesn't yet work as I think the async events are delayed

        new CloudService(this.persistenceLayerManager)
            .start();
        //
        // await this.persistenceLayerManager.start();

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
                                 repoDocInfoManager={this.repoDocInfoManager}
                                 repoDocInfoLoader={this.repoDocInfoLoader}
                                 syncBarProgress={syncBarProgress}/> );
        };

        const renderAnnotationRepoApp = () => {
            return ( <AnnotationRepoApp persistenceLayerManager={this.persistenceLayerManager}
                                        updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                                        syncBarProgress={syncBarProgress}/> );
        };

        ReactDOM.render(

            <div>

                <PrioritizedSplashes/>

                <SyncBar progress={syncBarProgress}/>

                <HashRouter hashType="noslash">

                    {/*FIXME: there is still more state management and  sync*/}
                    {/*management code in the DocRepoApp init and some other*/}
                    {/*places.*/}

                    <Switch>
                        <Route exact path='/' render={renderDocRepoApp}/>
                        <Route exact path='/annotations' render={renderAnnotationRepoApp}/>
                    </Switch>

                </HashRouter>

            </div>,

            document.getElementById('root') as HTMLElement

        );

        await this.repoDocInfoLoader.start();

        AppInstance.notifyStarted('RepositoryApp');

    }

    private onUpdatedDocInfo(docInfo: IDocInfo): void {

        log.info("Received DocInfo update");

        const repoDocInfo = RepoDocInfos.convertFromDocInfo(docInfo);

        if (RepoDocInfos.isValid(repoDocInfo)) {

            this.repoDocInfoManager.updateDocInfo(repoDocInfo.fingerprint, repoDocInfo);

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
