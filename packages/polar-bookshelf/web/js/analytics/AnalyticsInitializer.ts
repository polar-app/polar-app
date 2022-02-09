import {Analytics} from "./Analytics";
import {Version} from "polar-shared/src/util/Version";
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {Emails} from "polar-shared/src/util/Emails";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import firebase from 'firebase/app'
import {DeviceIDManager} from "polar-shared/src/util/DeviceIDManager";

export namespace AnalyticsInitializer {

    export function doInit() {

        init()
            .catch(err => console.error("Could not init analytics: ", err));

    }

    export async function init() {

        initVersion();
        await initAccount();

        console.log("Analytics initialized");

    }

    function initVersion() {
        Analytics.version(Version.get());
    }

    async function initAccount() {

        const doUserTraits = (user: firebase.User) => {

            const doUserEmailDomain = () => {

                // eslint-disable-next-line camelcase
                const user_email_domain = Emails.toDomain(user.email!) || "";

                Analytics.traits({
                    user_email_domain,
                });

            };

            const doUserCreated = () => {

                if (user.metadata.creationTime) {

                    // eslint-disable-next-line camelcase
                    const user_created_week = ISODateTimeStrings.toPartialWeek(user.metadata.creationTime)!;

                    // eslint-disable-next-line camelcase
                    const user_created_month = ISODateTimeStrings.toPartialMonth(user.metadata.creationTime)!;

                    // eslint-disable-next-line camelcase
                    const user_created_day = ISODateTimeStrings.toPartialDay(user.metadata.creationTime)!;

                    Analytics.traits({
                        user_created_week,
                        user_created_month,
                        user_created_day
                    });

                }

            };

            const doDeviceID = () => {

                const device_id = DeviceIDManager.DEVICE_ID

                Analytics.traits({
                    device_id
                });

            }

            doUserEmailDomain();
            doUserCreated();
            doDeviceID();

        };

        const user = await FirebaseBrowser.currentUserAsync();

        if (user) {

            Analytics.identify({
                uid: user.uid,
                email: user.email!,
                displayName: user.displayName || undefined,
                photoURL: user.photoURL || undefined,
                created: user.metadata.creationTime!
            });

            doUserTraits(user);

        }

    }

}
