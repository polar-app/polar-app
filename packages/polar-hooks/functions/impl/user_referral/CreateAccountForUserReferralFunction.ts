import {ExpressFunctions} from "../util/ExpressFunctions";
import {isPresent} from "polar-shared/src/Preconditions";
import {EmailStr, IDStr} from "polar-shared/src/util/Strings";
import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {UserReferrals} from "./UserReferrals";
import IReferrer = UserReferrals.IReferrer;
import IReferred = UserReferrals.IReferred;

// TODO: make these types published via API
export interface ICreateAccountForUserReferralRequest {

    readonly email: EmailStr;

    readonly user_referral_code: IDStr;

    /**
     * The name of this user for their new account.
     */
    readonly name: string;

}

export interface ICreateAccountForUserReferralResponse {
    readonly code: 'invalid-user-referral-code' | 'unable-to-handle-user-referral';
    readonly message: string;
}


export const CreateAccountForUserReferralFunction = ExpressFunctions.createHookAsync('CreateAccountForUserReferralFunction', async (req, res) => {

    if (req.method.toUpperCase() !== 'POST') {
        ExpressFunctions.sendResponse(res, "POST required", 500, 'text/plain');
        return;
    }

    if (!isPresent(req.body)) {
        ExpressFunctions.sendResponse(res, "No request body", 500, 'text/plain');
        return;
    }

    const request: ICreateAccountForUserReferralRequest = req.body;

    try {
        const firestore = FirestoreAdmin.getInstance();

        const userReferral = await UserReferralCollection.getByReferralCode(firestore, request.user_referral_code);

        if (! userReferral) {

            const response: ICreateAccountForUserReferralResponse = {
                code: "invalid-user-referral-code",
                message: 'User referral code does not exist: ' + request.user_referral_code,
            };

            ExpressFunctions.sendResponse(res, response);
            return;

        }

        function sendResponseOK() {

            const response = {
                code: 'ok',
            };

            ExpressFunctions.sendResponse(res, response);

        }

        const referrer: IReferrer = {
            uid: userReferral.uid,
            user_referral_code: userReferral.user_referral_code,
            email: userReferral.email
        };

        const referred: IReferred = {
            email: request.email,
            name: request.name
        }

        await UserReferrals.createNewAccountAndApplyReward('live', referrer, referred);

        sendResponseOK();

    } catch (e) {

        const response: ICreateAccountForUserReferralResponse = {
            code: 'unable-to-handle-user-referral',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            message: (e as any).message || "",
        };

        ExpressFunctions.sendResponse(res, response);

    }

});
