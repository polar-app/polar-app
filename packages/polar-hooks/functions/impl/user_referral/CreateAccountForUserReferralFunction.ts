import {ExpressFunctions} from "../util/ExpressFunctions";
import {isPresent} from "polar-shared/src/Preconditions";
import {EmailStr, IDStr} from "polar-shared/src/util/Strings";
import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {StripeCustomers} from "polar-payments-stripe/src/StripeCustomers";
import {StripeTrials} from "polar-payments-stripe/src/StripeTrials";
import {Billing} from "polar-accounts/src/Billing";
import {AmplitudeBackendAnalytics} from "polar-amplitude-backend/src/AmplitudeBackendAnalytics";
import V2PlanPlus = Billing.V2PlanPlus;

// TODO: make these types published via API
export interface ICreateAccountForUserReferralRequest {
    readonly email: EmailStr;
    readonly user_referral_code: IDStr;
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

        async function createFirebaseUser() {

            const password = Hashcodes.createRandomID();
            await FirebaseUserCreator.create(request.email, password);

        }

        async function createStripeSubscriptionWithTrial() {

            await StripeCustomers.createCustomer('live', request.email, request.name);

            const trial_end = StripeTrials.computeTrialEnds('30d');

            await StripeCustomers.changePlan('live', request.email, V2PlanPlus, 'month', trial_end);

        }

        async function doAmplitudeEvent() {
            await AmplitudeBackendAnalytics.event2('CreateAccountForUserReferralFunction', {user_referral_code: request.user_referral_code})
        }

        function sendResponseOK() {

            const response = {
                code: 'ok',
            };

            ExpressFunctions.sendResponse(res, response);

        }

        await createFirebaseUser();
        await createStripeSubscriptionWithTrial();
        await doAmplitudeEvent();
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
