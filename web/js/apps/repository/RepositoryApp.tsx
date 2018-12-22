import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {RemotePersistenceLayerFactory} from '../../datastore/factories/RemotePersistenceLayerFactory';
import {FileImportController} from './FileImportController';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {IDocInfo} from '../../metadata/DocInfo';
import {AppInstance} from '../../electron/framework/AppInstance';
import {PersistenceLayers} from '../../datastore/PersistenceLayers';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';
import {HashRouter, Switch, Route} from 'react-router-dom';
import {PrioritizedSplashes} from '../../../../apps/repository/js/splash/PrioritizedSplashes';
import {SyncBar, SyncBarProgress} from '../../ui/sync_bar/SyncBar';
import {DocRepoAnkiSyncController} from '../../controller/DocRepoAnkiSyncController';
import DocRepoApp from '../../../../apps/repository/js/doc_repo/DocRepoApp';
import AnnotationRepoApp from '../../../../apps/repository/js/annotation_repo/AnnotationRepoApp';

export class RepositoryApp {

    public async start() {

        const persistenceLayerManager = new PersistenceLayerManager();

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        const syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

        new FileImportController(persistenceLayerManager, updatedDocInfoEventDispatcher)
            .start();

        new DocRepoAnkiSyncController(persistenceLayerManager, syncBarProgress)
            .start();

        const renderDocRepoApp = () => {
            return ( <DocRepoApp persistenceLayerManager={persistenceLayerManager}
                                 updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                                 syncBarProgress={syncBarProgress}/> );
        };

        const renderAnnotationRepoApp = () => {
            return ( <AnnotationRepoApp persistenceLayerManager={persistenceLayerManager}
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
                        <Route exact path='/asdf' render={renderDocRepoApp}/>
                        <Route exact path='/' render={renderAnnotationRepoApp}/>
                    </Switch>

                </HashRouter>

            </div>,

            document.getElementById('root') as HTMLElement

        );

        AppInstance.notifyStarted('RepositoryApp');

    }

}
