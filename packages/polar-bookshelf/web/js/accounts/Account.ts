import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {accounts} from "polar-accounts/src/accounts";

export interface AccountUsage {
    readonly storageInBytes: number;
}

export interface AccountInit {

    readonly plan: accounts.Plan;
    readonly interval?: accounts.Interval;

}

export interface Account extends AccountInit {

    readonly id: string;

    /**
     * The users uid in Firebase.
     */
    readonly uid: string;

    /**
     * The accounts primary email address.  We might add more in the future.
     */
    readonly email: string;

    /**
     * The last time any important action was changed on the account. Payment
     * updated, etc.
     */
    readonly lastModified: ISODateTimeString;

}

export class AccountPlans {

    public static toInt(plan: accounts.Plan) {

        switch (plan) {
            case "free":
                return 0;
            case "bronze":
                return 1;
            case "silver":
                return 2;
            case "gold":
                return 3;
        }

    }

    /**
     * Return true if the required plan level is ok vs the actual plan level.
     */
    public static hasLevel(required: accounts.Plan, actual: accounts.Plan) {
        return this.toInt(required) <= this.toInt(actual);
    }

    public static toColor(plan: accounts.Plan) {
        switch (plan) {
            case "free":
                return "";
            case "bronze":
                return "#cc6633";
            case "silver":
                return "#C0C0C0";
            case "gold":
                return "#D4AF37";
        }
    }

}

