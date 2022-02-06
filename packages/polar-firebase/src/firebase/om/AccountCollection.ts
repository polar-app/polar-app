import {Billing, Trial} from "polar-accounts/src/Billing";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IDStr} from "polar-shared/src/util/Strings";

export type CustomerType = 'google_iap' | 'apple_iap' | 'stripe';

export interface IBaseCustomer<T extends CustomerType> {
    readonly type: T;
}

export interface IGoogleIAPCustomer extends IBaseCustomer<'google_iap'> {
    readonly customerID: IDStr;
}

export interface IAppleIAPCustomer extends IBaseCustomer<'apple_iap'> {
    readonly customerID: IDStr;
}

export interface IStripeCustomer extends IBaseCustomer<'stripe'> {
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
