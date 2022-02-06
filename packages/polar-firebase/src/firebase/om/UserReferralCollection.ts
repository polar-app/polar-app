import {IDStr} from "polar-shared/src/util/Strings";
import {UIDStr} from "polar-blocks/src/blocks/IBlock";

export namespace UserReferralCollection {

    // TODO: there are some more issues here
    //
    // - if a user doesn't have an account how do they invite since they don't have a uid
    // - how are rules permissions setup?

    export interface IUserReferral {

        readonly id: IDStr;

        readonly uid: UIDStr;

        /**
         * The referral code that this user uses to invite new users.
         */
        readonly referral_code: IDStr;

    }

}
