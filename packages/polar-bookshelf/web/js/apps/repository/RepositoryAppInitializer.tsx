import {AnalyticsInitializer} from "../../analytics/AnalyticsInitializer";
import {PinchToZoom} from "../../ui/Gestures";
import {UIModes} from "../../ui/uimodes/UIModes";
import {PlatformStyles} from "../../ui/PlatformStyles";
import {IEventDispatcher, SimpleReactor} from "../../reactor/SimpleReactor";
import {SyncBarProgress} from "../../ui/sync_bar/SyncBar";
import {AuthHandlers} from "./auth_handler/AuthHandler";
import {ProgressService} from "../../ui/progress_bar/ProgressService";
import {Version} from "polar-shared/src/util/Version";
import {PDFModernTextLayers} from "polar-pdf/src/pdf/PDFModernTextLayers";
import {Platforms} from "polar-shared/src/util/Platforms";
import {PersistenceLayerController, PersistenceLayerManager} from "../../datastore/PersistenceLayerManager";
import * as ReactDOM from "react-dom";
import {LoadingSplash} from "../../ui/loading_splash/LoadingSplash";
import * as React from "react";
import {PersistenceLayerProvider} from "../../datastore/PersistenceLayer";
import {Tracer} from "polar-shared/src/util/Tracer";
import {ASYNC_NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MailingList} from "./auth_handler/MailingList";

interface IAppInitializerOpts {

    readonly persistenceLayerManager: PersistenceLayerManager;

    // called after authentication is needed
    readonly onNeedsAuthentication?: (app: App) => Promise<void>;

}

export interface App {

    // readonly authStatus: AuthStatus;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
    readonly syncBarProgress: IEventDispatcher<SyncBarProgress>;

}

export class RepositoryAppInitializer {

    public static init(opts: IAppInitializerOpts): App {

        const {persistenceLayerManager} = opts;

        console.time("AppInitializer.init");

        const syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

        console.info("Running with Polar version: " + Version.get());

        AnalyticsInitializer.doInit();

        renderLoadingSplash();

        PinchToZoom.disable();

        const persistenceLayerProvider = () => persistenceLayerManager.get();
        const persistenceLayerController = persistenceLayerManager;

        UIModes.register();
        PlatformStyles.assign();

        // AppOrigin.configure();

        PDFModernTextLayers.configure();

        const authHandler = AuthHandlers.get();

        const platform = Platforms.get();

        console.log("Running on platform: " + Platforms.toSymbol(platform));

        const app: App = {
            persistenceLayerManager, persistenceLayerProvider,
            persistenceLayerController, syncBarProgress,
        };

        new ProgressService().start();

        // TODO: check if we need authentication but do so in the background.

        async function handleAuth() {

            // TODO: I think this could/should be a react component?

            const authStatus = await Tracer.async(authHandler.status(), 'AppInitializer.authHandler.status');

            if (authStatus.type !== 'needs-authentication') {

                // TODO: add this to the FirebaseUserCreator

                // subscribe but do it in the background as this isn't a high priority UI task.
                MailingList.subscribeWhenNecessary(authStatus)
                           .catch(err => console.error(err));

                const onNeedsAuthentication = opts.onNeedsAuthentication || ASYNC_NULL_FUNCTION;

                await onNeedsAuthentication(app);

            }

        }

        handleAuth()
            .catch(err => console.error("Could not handle auth: ", err));

        console.timeEnd("AppInitializer.init");

        return app;

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