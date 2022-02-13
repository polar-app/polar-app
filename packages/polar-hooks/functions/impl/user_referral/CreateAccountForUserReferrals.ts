import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {UserReferrals} from "./UserReferrals";
import {
    IAnswerExecutorErrorInvalidUserReferralCode,
    ICreateAccountForUserReferralFailed,
    ICreateAccountForUserReferralRequest,
    ICreateAccountForUserReferralResponse
} from "polar-backend-api/src/api/CreateAccountForUserReferral";
import IReferrer = UserReferrals.IReferrer;
import IReferred = UserReferrals.IReferred;

export namespace CreateAccountForUserReferrals {

    export async function exec(request: ICreateAccountForUserReferralRequest): Promise<IAnswerExecutorErrorInvalidUserReferralCode | ICreateAccountForUserReferralResponse | ICreateAccountForUserReferralFailed> {

        try {
            const firestore = FirestoreAdmin.getInstance();

            const userReferral = await UserReferralCollection.getByUserReferralCode(firestore, request.user_referral_code);

            if (!userReferral) {

                return <IAnswerExecutorErrorInvalidUserReferralCode>{
                    error: true,
                    code: "invalid-user-referral-code",
                };

            }

            function createResponseOK() {

                return <ICreateAccountForUserReferralResponse>{
                    code: 'ok',
                };

            }

            const referrer: IReferrer = {
                uid: userReferral.uid,
                user_referral_code: userReferral.user_referral_code,
                email: userReferral.email
            };

            const referred: IReferred = {
                email: request.email,
            }

            await UserReferrals.createReferredAccountAndApplyRewardToReferrer('live', referrer, referred);

            return createResponseOK();

        } catch (e) {

            console.error(e);

            return <ICreateAccountForUserReferralFailed>{
                error: true,
                code: 'failed',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message: (e as any).message || "",
            };

        }
    }
}
