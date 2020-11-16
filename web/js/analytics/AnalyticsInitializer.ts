import {Analytics} from "./Analytics";
import {Version} from "polar-shared/src/util/Version";
import {Firebase} from "../firebase/Firebase";
import {Emails} from "polar-shared/src/util/Emails";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {FirestoreCollections} from "../../../apps/repository/js/reviewer/FirestoreCollections";
import firebase from 'firebase/app'

export namespace AnalyticsInitializer {

   export function doInit() {

        init()
            .catch(err => console.error("Could not init analytics: ", err));

    }

   export async function init() {

        // TODO: this forces Firestore to be initialized, which I don't like and
        // this should happen somewhere else like a root component.
        await FirestoreCollections.configure();

        initVersion();
        initAccount();
        initHeartbeat();

    }

    function initVersion() {
        Analytics.version(Version.get());
    }

    function initHeartbeat() {
        Analytics.heartbeat();
    }

    function initAccount() {

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

        // TODO: add this back in...
        // const doPlan = async () => {
        //
        //     const account = await Accounts.get();
        //
        //     const plan = account?.plan || 'free';
        //
        //     Analytics.traits({plan});
        //
        // };

        const user = Firebase.currentUser();

        if (user) {

            Analytics.identify(user.uid);

            doUserCreated(user);
            // TODO: add this back in.
            // await doPlan();

        }

    }

}
