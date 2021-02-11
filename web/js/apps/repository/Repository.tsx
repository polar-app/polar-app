import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {AppInstance} from '../../electron/framework/AppInstance';
import {
    PersistenceLayerManager,
} from '../../datastore/PersistenceLayerManager';
import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import {Accounts} from '../../accounts/Accounts';
import {App, AppInitializer} from "./AppInitializer";
import {RepositoryApp} from './RepositoryApp';
import {Tracer} from 'polar-shared/src/util/Tracer';
import {AuthHandlers} from "./auth_handler/AuthHandler";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";
import {ConsoleRecorder} from "polar-shared/src/util/ConsoleRecorder";
import {SentryBrowser} from "../../logger/SentryBrowser";

const log = Logger.create();

export class Repository {

    constructor(private readonly persistenceLayerManager = new PersistenceLayerManager(),
                private readonly repoDocMetaManager = new RepoDocMetaManager(persistenceLayerManager),
                private readonly repoDocMetaLoader = new RepoDocMetaLoader(persistenceLayerManager)) {
    }

    public async start() {

        SentryBrowser.initWhenNecessary();
        ConsoleRecorder.start();

        console.log("Starting repository with app runtime: " + AppRuntime.get());

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        const persistenceLayerManager = this.persistenceLayerManager;

        const app = await AppInitializer.init({
            persistenceLayerManager,

            onNeedsAuthentication: async (app: App) => {


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

            // TODO: first , we're reading authHandler here twice... once in
            // AppInitializer and then again here.  Also, it doesn't make sense
            // to start this code UNTIL we're actually using a client that
            // needs to read this data so in a new tab this just slows us down.
            //
            // it would be better to use some type of latch to trigger this but
            // only when the repository needs it...

            const authHandler = AuthHandlers.get();

            console.log("Getting auth status...");
            const authStatus = await Tracer.async(authHandler.status(), 'auth-handler');
            console.log("Getting auth status...done");

            // TODO: return authStatus as an object and then do authState.authenticated
            // and unauthenticated so that if statements are cleaner
            if (authStatus.type !== 'needs-authentication') {

                this.handleRepoDocInfoEvents();

                await this.repoDocMetaLoader.start();

                await persistenceLayerManager.start();

                console.log("Started repo doc loader.");

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
}

function getRootElement() {

    const rootElement = document.getElementById('root') as HTMLElement;

    if (! rootElement) {
        throw new Error("No root element to which to render");
    }

    return rootElement;

}

