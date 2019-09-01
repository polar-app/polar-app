import {BackgroundListeners} from "../../../util/BackgroundListener";
import {UserGroups} from "./UserGroups";

/**
 * Provides us with a background updated snapshot of the latest UserGroups
 * which stays active in memory.  Even with cache it seems FB has some latencies.
 */
export class UserGroupsBackgroundListener {

    private static delegate = BackgroundListeners.create(UserGroups);

    public static async start() {
        await this.delegate.start();
    }

    public static get(): UserGroups | undefined {
        return this.delegate.get();
    }

}

