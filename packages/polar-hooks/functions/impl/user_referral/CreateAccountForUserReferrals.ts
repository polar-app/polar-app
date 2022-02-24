import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {UserReferrals} from "./UserReferrals";
import {
    IAnswerExecutorErrorInvalidUserReferralCode, IAnswerExecutorErrorNotUniversityEmail,
    ICreateAccountForUserReferralFailed,
    ICreateAccountForUserReferralRequest,
    ICreateAccountForUserReferralResponse
} from "polar-backend-api/src/api/CreateAccountForUserReferral";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
import IReferrer = UserReferrals.IReferrer;
import IReferred = UserReferrals.IReferred;
import {UniversityEmails} from "polar-shared/src/util/UniversityEmails";

export namespace CreateAccountForUserReferrals {

    import IFirebaseUserRecord = FirebaseUserCreator.IFirebaseUserRecord;

    export async function exec(request: ICreateAccountForUserReferralRequest, stripeMode: 'live' | 'test' = 'live'): Promise<IAnswerExecutorErrorNotUniversityEmail | IAnswerExecutorErrorInvalidUserReferralCode | ICreateAccountForUserReferralResponse | ICreateAccountForUserReferralFailed> {

        try {

            const university = UniversityEmails.getUniversityByEmailDomain(request.email);

            if (!university) {
                return <IAnswerExecutorErrorNotUniversityEmail>{
                    error: true,
                    code: "not-university-email",
                };
            }

            const firestore = FirestoreAdmin.getInstance();

            const userReferral = await UserReferralCollection.getByUserReferralCode(firestore, request.user_referral_code);

            if (!userReferral) {

                return <IAnswerExecutorErrorInvalidUserReferralCode>{
                    error: true,
                    code: "invalid-user-referral-code",
                };

            }

            async function createResponseOK(newUser: IFirebaseUserRecord) {

                async function createAuthToken() {
                    const firebase = FirebaseAdmin.app();
                    const auth = firebase.auth();
                    return await auth.createCustomToken(newUser.uid);
                }

                const auth_token = await createAuthToken();

                return <ICreateAccountForUserReferralResponse>{
                    code: 'ok',
                    auth_token
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
