import {Billing, Trial} from "polar-accounts/src/Billing";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IDStr} from "polar-shared/src/util/Strings";

export interface IGoogleIAPCustomer {
    readonly type: 'google_iap';
    readonly customerID: IDStr;
}

export interface IAppleIAPCustomer {
    readonly type: 'apple_iap';
    readonly customerID: IDStr;
}

export interface IStripeCustomer {
    readonly type: 'stripe';
    readonly customerID: IDStr;
}

export type Customer = IStripeCustomer | IAppleIAPCustomer | IGoogleIAPCustomer;

export interface IAccountInit {

    readonly plan: Billing.Plan;
    readonly interval?: Billing.Interval;

}

export interface IAccount extends IAccountInit {

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

    readonly trial?: Trial;

    readonly customer?: Customer;

    /**
     * When does this subscription expire
     */
    readonly expiresAt?: ISODateTimeString;

}
