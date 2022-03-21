import { AuthChallengeCollection } from "polar-firebase/src/firebase/om/AuthChallengeCollection";
import { FirestoreAdmin } from "polar-firebase-admin/src/FirestoreAdmin";
import { FirebaseAdmin } from "polar-firebase-admin/src/FirebaseAdmin";
import { IDUser } from "polar-rpc/src/IDUser";
import { ExpressFunctions } from "../util/ExpressFunctions";
import {
    IVerifyTokenEmailRequest,
    IVerifyTokenEmailResponse,
    IVerifyTokenEmailError,
    ErrorCode
} from "polar-backend-api/src/api/VerifyTokenEmail";

export type ValidationResult = ValidationPassed | ValidationFailed;

export interface ValidationFailed {
    failed: true,
    code: ErrorCode
}

export interface ValidationPassed {
    failed: false,
}


export namespace VerifyTokenEmail {

    export async function validateChallenge(request: IVerifyTokenEmailRequest): Promise<ValidationResult> {
        const firestore = FirestoreAdmin.getInstance();

        const authChallenge = await AuthChallengeCollection.get(firestore, request.newEmail);

        if (!authChallenge) {
            return {
                failed: true,
                code: "no-email-for-challenge"
            };
        }
        
        if (authChallenge.challenge !== request.challenge) {
            return {
                failed: true,
                code: "invalid-challenge"
            };
        }

        return {
            failed: false,
        };
    }
    export async function exec(
        idUser: IDUser,
        request: IVerifyTokenEmailRequest): Promise<IVerifyTokenEmailResponse | IVerifyTokenEmailError> {
        
        const validation = await validateChallenge(request);

        if (validation.failed) {
            return {
                code: validation.code
            }
        }
        
        const firebase = FirebaseAdmin.app();

        await firebase.auth().updateUser(idUser.uid, {
            email: request.newEmail
        });

        return {
            code: "ok"
        };
    }
}

export const VerifyTokenEmailFunction = ExpressFunctions.createRPCHook("VerifyTokenEmailFunction", VerifyTokenEmail.exec);