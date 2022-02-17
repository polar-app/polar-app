import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {UserReferrals} from "./UserReferrals";
import {
    IAnswerExecutorErrorInvalidUserReferralCode,
    ICreateAccountForUserReferralFailed,
    ICreateAccountForUserReferralRequest,
    ICreateAccountForUserReferralResponse
} from "polar-backend-api/src/api/CreateAccountForUserReferral";
import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
import {StartTokenAuths} from "../token_auth/StartTokenAuths";
import IReferrer = UserReferrals.IReferrer;
import IReferred = UserReferrals.IReferred;

export namespace CreateAccountForUserReferrals {

    import IFirebaseUserRecord = FirebaseUserCreator.IFirebaseUserRecord;

    export async function exec(request: ICreateAccountForUserReferralRequest, stripeMode: 'live' | 'test' = 'live'): Promise<IAnswerExecutorErrorInvalidUserReferralCode | ICreateAccountForUserReferralResponse | ICreateAccountForUserReferralFailed> {

        try {

            const firestore = FirestoreAdmin.getInstance();

            const userReferral = await UserReferralCollection.getByUserReferralCode(firestore, request.user_referral_code);

            if (!userReferral) {

                return <IAnswerExecutorErrorInvalidUserReferralCode>{
                    error: true,
                    code: "invalid-user-referral-code",
                };

            }

            async function createResponseOK(newUser: IFirebaseUserRecord) {

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

            const newUser = await UserReferrals.createReferredAccountAndApplyRewardToReferrer(stripeMode, referrer, referred);

            // TODO we should NOT grant auth here just yet... that's the next big thing I have to fix..

            // now trigger the start token auth process so that they can just auth directly
            await StartTokenAuths.startTokenAuth({email: newUser.email});

            return await createResponseOK(newUser);

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
