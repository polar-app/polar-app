import {Analytics} from "./Analytics";
import {Version} from "polar-shared/src/util/Version";
import {Firebase} from "../firebase/Firebase";

export class AnalyticsInitializer {

    public static async init() {

        Analytics.version(Version.get());

        const userID = await Firebase.currentUserID();

        if (userID) {
            Analytics.identify(userID);
        }

    }

}
