import {Billing, Trial} from "polar-accounts/src/Billing";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {EmailStr, IDStr} from "polar-shared/src/util/Strings";
import {UIDStr} from "polar-blocks/src/blocks/IBlock";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";

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

export type AccountVer = 'v2';

export interface IAccount extends IAccountInit {

    readonly id: IDStr;

    /**
     * The version of the account and the metadata that this account provides.
     *
     * v2: adds the user_referral table...
     */
    readonly ver: undefined | AccountVer;

    /**
     * The users uid in Firebase.
     */
    readonly uid: UIDStr;

    /**
     * The accounts primary email address.  We might add more in the future.
     */
    readonly email: EmailStr;

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

export namespace AccountCollection {

    // TODO: need an 'upgrade' to add v2 to the version of this IAccount..

    export const COLLECTION_NAME = 'account';


    export async function get<SM = unknown>(firestore: IFirestore<SM>, uid: UIDStr) {
        return await Collections.get<IAccount>(firestore, COLLECTION_NAME, uid);
    }

    export async function set<SM = unknown>(firestore: IFirestore<SM>, uid: UIDStr, account: IAccount) {
        return await Collections.set<IAccount>(firestore, COLLECTION_NAME, uid, account);
    }

    /**
     * Upgrade this account to a specific version.
     */
    export async function upgrade<SM = unknown>(firestore: IFirestore<SM>, uid: UIDStr, email: EmailStr, ver: AccountVer) {

        const account = await get(firestore, uid);

        const now = ISODateTimeStrings.create();

        if (account) {
            await Collections.update(firestore, COLLECTION_NAME, uid, {ver, lastModified: now});
        } else {

            const newAccount: IAccount = {
                id: uid,
                uid,
                email,
                lastModified: now,
                ver,
                plan: 'free'
            }

            await set(firestore, uid, newAccount);

        }
    }

}
