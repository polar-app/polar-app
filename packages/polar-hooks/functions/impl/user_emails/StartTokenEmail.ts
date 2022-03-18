import { IDUser } from "polar-rpc/src/IDUser";
import { IStartTokenEmailError, IStartTokenEmailRequest, IStartTokenEmailResponse } from "polar-backend-api/src/api/StartTokenEmail";
import { createOrFetchChallenge } from "../token_auth/StartTokenAuthFunction";
import { Sendgrid } from "polar-sendgrid/src/Sendgrid";
import { FirebaseAdmin } from "polar-firebase-admin/src/FirebaseAdmin";
import { ExpressFunctions } from "../util/ExpressFunctions";


export namespace VerifyTokenEmail {
    interface IEmailTemplate {
        readonly to: string;
        readonly from: string;
        readonly subject: string;
        readonly html: string;
    }

    async function isEmailUsed(email: string): Promise<boolean> {
        try {
            await FirebaseAdmin.app().auth().getUserByEmail(email);
            return true;
        } catch (error) {
            return false;
        }
    }

    function createEmailTemplate(challenge: string, email: string): IEmailTemplate {
        const p0 = challenge.substring(0, 3);
        const p1 = challenge.substring(3, 6);

        return {
            to: email,
            from: 'noreply@getpolarized.io',
            subject: `Please use code ${p0} ${p1} to update your email`,
            html: `<p>Please use the following code to update your email:</p>
                    <p><span style="font-size: 30px;"><b>${p0} ${p1}</b></span></p>
                    <p style="font-size: smaller; color: #c6c6c6;">Sent via sendgrid</p>`
        };
    }

    export async function exec(idUser: IDUser,
                               request: IStartTokenEmailRequest): Promise<IStartTokenEmailResponse | IStartTokenEmailError> {
                                
        if (await isEmailUsed(request.newEmail)) {
            return {
                code: "email-already-being-used"
            };
        }
        
        const { challenge } = await createOrFetchChallenge(request.newEmail);

        await Sendgrid.send(
            createEmailTemplate(challenge, request.newEmail)
        );

        return {
            code: 'ok'
        };
    }
}

export const StartTokenEmailFunction = ExpressFunctions.createRPCHook("StartTokenEmailFunction", VerifyTokenEmail.exec);