import {Analytics} from "./Analytics";
import {Version} from "polar-shared/src/util/Version";
import {Firebase} from "../firebase/Firebase";
import {Accounts} from "../accounts/Accounts";
import {Logger} from "polar-shared/src/logger/Logger";
import {Emails} from "polar-shared/src/util/Emails";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {FirestoreCollections} from "../../../apps/repository/js/reviewer/FirestoreCollections";
import {AnalyticsURLCanonicalizer} from "./AnalyticsURLCanonicalizer";

const log = Logger.create();

export class AnalyticsInitializer {

    public static doInit() {

        // FIXME: at least SOME if these operations are taking too long...

        this.init()
            .catch(err => log.error("Could not init analytics: ", err));

    }

    public static async init() {

        await FirestoreCollections.configure();

        this.initVersion();
        this.initAccount();
        this.initNavigation();
        this.initHeartbeat();
    }

    private static initVersion() {
        Analytics.version(Version.get());
    }

    private static initHeartbeat() {
        Analytics.heartbeat();
    }

    private static async initAccount() {

        const doUserCreated = (user: firebase.User) => {

            const doUserEmailDomain = () => {

                // tslint:disable-next-line:variable-name
                const user_email_domain = Emails.toDomain(user.email!) || "";

                Analytics.traits({
                    user_email_domain,
                });

            };

            const doUserCreated = () => {

                if (user.metadata.creationTime) {

                    // tslint:disable-next-line:variable-name
                    const user_created_week = ISODateTimeStrings.toPartialWeek(user.metadata.creationTime)!;

                    // tslint:disable-next-line:variable-name
                    const user_created_month = ISODateTimeStrings.toPartialMonth(user.metadata.creationTime)!;

                    // tslint:disable-next-line:variable-name
                    const user_created_day = ISODateTimeStrings.toPartialDay(user.metadata.creationTime)!;

                    Analytics.traits({
                        user_created_week,
                        user_created_month,
                        user_created_day
                    });

                }

            };

            doUserEmailDomain();
            doUserCreated();

        };

        const doPlan = async () => {

            const account = await Accounts.get();

            const plan = account?.plan || 'free';

            Analytics.traits({plan});

        };

        const user = await Firebase.currentUser();

        if (user) {

            Analytics.identify(user.uid);

            doUserCreated(user);
            await doPlan();

        }

    }

    private static async initNavigation() {

        const onNavChange = () => {

            try {

                const url = new URL(document.location!.href);

                // TODO: what about query params??
                const path = AnalyticsURLCanonicalizer.canonicalize(url.pathname + url.hash || "");
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
