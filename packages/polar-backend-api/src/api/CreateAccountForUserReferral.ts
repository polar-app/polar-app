import {EmailStr, IDStr} from "polar-shared/src/util/Strings";
import {IRPCError} from "polar-shared/src/util/IRPCError";

export interface ICreateAccountForUserReferralRequest {

    readonly email: EmailStr;

    readonly user_referral_code: IDStr;

}

export type AuthTokenStr = string;

export interface ICreateAccountForUserReferralResponse {
    readonly code: 'ok';
    readonly auth_token: AuthTokenStr;
}

export type ICreateAccountForUserReferralError =
    ICreateAccountForUserReferralFailed
    | IAnswerExecutorErrorInvalidUserReferralCode
    | IAnswerExecutorErrorNotUniversityEmail;

export interface ICreateAccountForUserReferralFailed extends IRPCError<'failed'> {
    readonly message: string;
}

export type IAnswerExecutorErrorInvalidUserReferralCode = IRPCError<'invalid-user-referral-code'>;
export type IAnswerExecutorErrorNotUniversityEmail = IRPCError<'not-university-email'>;

