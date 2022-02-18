import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {PersistenceLayerManager,} from '../../datastore/PersistenceLayerManager';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import {Accounts} from '../../accounts/Accounts';
import {RepositoryAppInitializer} from "./RepositoryAppInitializer";
import {RepositoryApp} from './RepositoryApp';
import {Tracer} from 'polar-shared/src/util/Tracer';
import {AuthHandlers} from "./auth_handler/AuthHandler";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";
import {SentryBrowser} from "../../logger/SentryBrowser";

export interface IRepository {
    readonly start: () => Promise<void>;
}

export namespace Repository {

    const persistenceLayerManager = new PersistenceLayerManager();
    const repoDocMetaManager = new RepoDocMetaManager(persistenceLayerManager);
    const repoDocMetaLoader = new RepoDocMetaLoader(persistenceLayerManager);

    function onFileUpload() {
        console.log("File uploaded and sending event via postMessage");
        window.postMessage({type: 'file-uploaded'}, '*');
    }

    function handleRepoDocInfoEvents() {

        repoDocMetaLoader.addEventListener(event => {

            for (const mutation of event.mutations) {

                if (mutation.mutationType === 'created' || mutation.mutationType === 'updated') {
                    repoDocMetaManager.updateFromRepoDocMeta(mutation.fingerprint, mutation.repoDocMeta!);
                } else {
                    repoDocMetaManager.updateFromRepoDocMeta(mutation.fingerprint, undefined);
                }

            }

        });

    }
    async function start() {

        const rootElement = getRootElement();

        SentryBrowser.initWhenNecessary();

        console.log("Starting repository with app runtime: " + AppRuntime.get());

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        const app = RepositoryAppInitializer.init({
            persistenceLayerManager,

            onNeedsAuthentication: async () => {


            }

        });

        Accounts.listenForPlanUpgrades()
            .catch(err => console.error("Unable to listen for plan upgrades: ", err));

        // TODO: splashes renders far far far too late and there's a delay.

        ReactDOM.render(
            <RepositoryApp app={app}
                           persistenceLayerManager={persistenceLayerManager}
                           repoDocMetaManager={repoDocMetaManager}
                           repoDocMetaLoader={repoDocMetaLoader}
                           updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}
                           onFileUpload={onFileUpload}/>
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

                handleRepoDocInfoEvents();

                await repoDocMetaLoader.start();

                await persistenceLayerManager.start();

                console.log("Started repo doc loader.");

            }

        }

        handleAuth()
            .catch(err => console.error("Could not handle auth: ", err));

    }

    export function create(): IRepository {
        return {start};
    }

}

function getRootElement() {

    const rootElement = document.getElementById('root') as HTMLElement;

    if (! rootElement) {
        throw new Error("No root element to which to render");
    }

    return rootElement;

}

