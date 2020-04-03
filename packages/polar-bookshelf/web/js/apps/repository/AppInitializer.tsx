import {AnalyticsInitializer} from "../../analytics/AnalyticsInitializer";
import {PinchToZoom} from "../../ui/Gestures";
import {ExternalNavigationBlock} from "../../electron/navigation/ExternalNavigationBlock";
import {UIModes} from "../../ui/uimodes/UIModes";
import {PlatformStyles} from "../../ui/PlatformStyles";
import {AppOrigin} from "../AppOrigin";
import {IEventDispatcher, SimpleReactor} from "../../reactor/SimpleReactor";
import {SyncBarProgress} from "../../ui/sync_bar/SyncBar";
import {AuthHandlers, AuthStatus, UserInfo} from "./auth_handler/AuthHandler";
import {Accounts} from "../../accounts/Accounts";
import {Account} from "../../accounts/Account";
import {AccountProvider} from "../../accounts/AccountProvider";
import {MailingList} from "./auth_handler/MailingList";
import {UpdatesController} from "../../auto_updates/UpdatesController";
import {ToasterService} from "../../ui/toaster/ToasterService";
import {ProgressService} from "../../ui/progress_bar/ProgressService";
import {PrefetchedUserGroupsBackgroundListener} from "../../datastore/sharing/db/PrefetchedUserGroupsBackgroundListener";
import {MachineDatastores} from "../../telemetry/MachineDatastores";
import {UniqueMachines} from "../../telemetry/UniqueMachines";
import {Logger} from "polar-shared/src/logger/Logger";
import {Version} from "polar-shared/src/util/Version";
import {PDFModernTextLayers} from "polar-pdf/src/pdf/PDFModernTextLayers";
import {Platforms} from "polar-shared/src/util/Platforms";
import {
    PersistenceLayerController,
    PersistenceLayerManager
} from "../../datastore/PersistenceLayerManager";
import * as ReactDOM from "react-dom";
import {LoadingSplash} from "../../ui/loading_splash/LoadingSplash";
import * as React from "react";
import {ListenablePersistenceLayerProvider} from "../../datastore/PersistenceLayer";

const log = Logger.create();

interface IAppInitializerOpts {

    readonly persistenceLayerManager: PersistenceLayerManager;

    // called after authentication is needed
    readonly onNeedsAuthentication: (app: App) => Promise<void>;

}

export interface App {

    readonly authStatus: AuthStatus;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
    readonly syncBarProgress: IEventDispatcher<SyncBarProgress>;
    readonly account: Account | undefined;
    readonly userInfo: UserInfo | undefined;

}

export class AppInitializer {

    public static async init(opts: IAppInitializerOpts): Promise<App> {

        const {persistenceLayerManager} = opts;

        const syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

        log.info("Running with Polar version: " + Version.get());

        AnalyticsInitializer.doInit();

        renderLoadingSplash();

        PinchToZoom.disable();

        // enable the navigation block.  This enables it by default and then turns
        // it on again after login is completed.
        ExternalNavigationBlock.set(true);

        const persistenceLayerProvider = () => persistenceLayerManager.get();
        const persistenceLayerController = persistenceLayerManager;

        UIModes.register();
        PlatformStyles.assign();

        AppOrigin.configure();

        PDFModernTextLayers.configure();

        const authHandler = AuthHandlers.get();

        const authStatus = await authHandler.status();

        const account = await Accounts.get();
        await AccountProvider.init(account);
        const userInfo = await authHandler.userInfo();

        const platform = Platforms.get();

        log.notice("Running on platform: " + Platforms.toSymbol(platform));

        const app: App = {
            authStatus, persistenceLayerManager, persistenceLayerProvider,
            persistenceLayerController, syncBarProgress, account,
            userInfo: userInfo.getOrUndefined()
        };

        if (authStatus !== 'needs-authentication') {

            // subscribe but do it in the background as this isn't a high priority UI task.
            MailingList.subscribeWhenNecessary()
                .catch(err => log.error(err));

            new UpdatesController().start();

            new ToasterService().start();

            new ProgressService().start();

            await PrefetchedUserGroupsBackgroundListener.start();

            MachineDatastores.triggerBackgroundUpdates(persistenceLayerManager);

            UniqueMachines.trigger();

            await opts.onNeedsAuthentication(app);

        }

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
