import {Analytics} from "./Analytics";
import {Version} from "polar-shared/src/util/Version";
import {Firebase} from "../firebase/Firebase";
import {Accounts} from "../accounts/Accounts";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class AnalyticsInitializer {

    public static doInit() {

        this.init()
            .catch(err => log.error("Could not init analytics: ", err));

    }

    public static async init() {
        this.initVersion();
        this.initAccount();
        this.initNavigation();
    }

    private static initVersion() {
        Analytics.version(Version.get());
    }

    private static async initAccount() {

        const userID = await Firebase.currentUserID();

        if (userID) {
            Analytics.identify(userID);

            const account = await Accounts.get();

            const plan = account?.plan || 'free';

            Analytics.traits({plan});
        }

    }

    private static async initNavigation() {

        const onNavChange = () => {

            try {

                const url = new URL(document.location!.href);

                const path = url.pathname + url.hash || "";
                const hostname = url.hostname;
                const title = document.title;

                log.info("Navigating to: ", { path, hostname, title });

                Analytics.page(path);

            } catch (e) {
                log.error("Unable to handle hash change", e);
            }

        };

        // must be called the first time so that we have analytics for the home
        // page on first load.
        onNavChange();

        window.addEventListener("hashchange", () => onNavChange(), false);

    }

}
