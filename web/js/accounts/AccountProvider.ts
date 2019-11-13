import {Accounts} from "./Accounts";
import {Account} from "./Account";

/**
 * Provides the user account once logged in, and listens for the most recent copy of the account,
 */
export class AccountProvider {

    private static account: Account | undefined;

    public static async init() {
        await Accounts.onSnapshot(account => this.account = account);
    }

    public static get() {
        return this.account;
    }

}
