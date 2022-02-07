import {EmailStr, IDStr} from "polar-shared/src/util/Strings";

export interface ICreateAccountForUserReferralRequest {

    readonly email: EmailStr;

    readonly user_referral_code: IDStr;

}

export interface ICreateAccountForUserReferralResponse {
    readonly code: 'invalid-user-referral-code' | 'unable-to-handle-user-referral';
    readonly message: string;
}
