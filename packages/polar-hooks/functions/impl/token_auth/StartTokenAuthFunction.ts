import {EmailStr, Strings} from "polar-shared/src/util/Strings";
import {Sendgrid} from "../Sendgrid";
import {ExpressFunctions} from "../util/ExpressFunctions";
import {isPresent} from "polar-shared/src/Preconditions";
import {Mailgun} from "../Mailgun";
import {AuthChallengeCollection} from "polar-firebase/src/firebase/om/AuthChallengeCollection";
import IAuthChallenge = AuthChallengeCollection.IAuthChallenge;
import {AuthChallengeFixedCollection} from "polar-firebase/src/firebase/om/AuthChallengeFixedCollection";
import {FirestoreAdminClient} from "@google-cloud/firestore/types/v1/firestore_admin_client";
import { FirestoreAdmin } from "polar-firebase-admin/src/FirestoreAdmin";

export interface IStartTokenAuthRequest {
    readonly email: string;
    readonly resend?: boolean | string;
}

export type MailProvider = 'sendgrid' | 'mailgun';

export interface IStartTokenErrorResponse {
    readonly code: 'unable-to-send-email';
    readonly status: 'unable-to-send-email';
    readonly message: string;
    readonly email: string;
}

export interface IStartTokenAuthResponse {
    readonly code: 'ok';
    readonly status: 'ok';
}

interface IChallenge {
    readonly challenge: string;
}

interface IChallengeWithParts {
    readonly p0: string;
    readonly p1: string;
    readonly challenge: string;
}

export async function createOrFetchChallenge(email: EmailStr): Promise<IChallenge> {

    const firestore = FirestoreAdmin.getInstance();
    const fixed = await AuthChallengeFixedCollection.get(firestore, email);

    if (fixed) {
        return {challenge: fixed.challenge};
    }

    return createChallenge();

}

export function createChallenge(): IChallengeWithParts {

    const n0 = Math.floor(Math.random() * 999);
    const n1 = Math.floor(Math.random() * 999);

    const p0 = Strings.lpad(n0, '0', 3);
    const p1 = Strings.lpad(n1, '0', 3);

    const challenge = p0 + p1;
    return {challenge, p0, p1};
}

export const StartTokenAuthFunction = ExpressFunctions.createHookAsync('StartTokenAuthFunction', async (req, res) => {

    if (req.method.toUpperCase() !== 'POST') {
        ExpressFunctions.sendResponse(res, "POST required", 500, 'text/plain');
        return;
    }

    if (! isPresent(req.body)) {
        ExpressFunctions.sendResponse(res, "No request body", 500, 'text/plain');
        return;
    }

    const request: IStartTokenAuthRequest = req.body;

    console.log("Handling request: ", typeof request, request);

    const {email, resend} = request;

    interface IEmailTemplate {
        readonly to: string;
        readonly from: string;
        readonly subject: string;
        readonly html: string;
    }

    function createEmailTemplate(challenge: IChallenge | IAuthChallenge, provider: MailProvider): IEmailTemplate {

        const p0 = challenge.challenge.substring(0, 3);
        const p1 = challenge.challenge.substring(3, 6);

        return {
            to: email,
            from: 'noreply@getpolarized.io',
            subject: `Please Sign in to Polar with code ${p0} ${p1}`,
            html: `<p>Please use the following code to sign in to Polar:</p>
                   <p><span style="font-size: 30px;"><b>${p0} ${p1}</b></span></p>
                   <p style="font-size: smaller; color: #c6c6c6;">Sent via ${provider}</p>`
        };

    }

    function sendResponseOK() {

        const response: IStartTokenAuthResponse = {
            code: 'ok',
            status: "ok"
        };

        ExpressFunctions.sendResponse(res, response);

    }

    async function sendMailWithProvider(message: IEmailTemplate,
                                        provider: MailProvider) {

        switch(provider) {

            case "sendgrid":
                await Sendgrid.send(message);
                break;
            case "mailgun":
                await Mailgun.send(message);
                break;

        }

    }

    async function sendInitialMessage() {

        // TODO: the challenges should expire.
        const challenge = await createOrFetchChallenge(email)

        const firestore = FirestoreAdmin.getInstance();
        await AuthChallengeCollection.write(firestore, email, challenge.challenge)

        const provider = 'sendgrid';

        const tmpl = createEmailTemplate(challenge, provider);

        await sendMailWithProvider(tmpl, provider);

        sendResponseOK();

        console.log(`Send 'initial' with provider: ${provider}`);

    }

    async function resendMessage() {

        const firestore = FirestoreAdmin.getInstance();
        const challenge = await AuthChallengeCollection.get(firestore, email);

        if (! challenge) {
            throw new Error("No previous challenge sent");
        }

        const provider = 'mailgun';

        const tmpl = createEmailTemplate(challenge, provider);

        await sendMailWithProvider(tmpl, provider);

        console.log(`Send 'resend' with provider: ${provider}`);

        sendResponseOK();

    }

    try {

        if (resend === true || resend === 'true') {
            await resendMessage();
        } else {
            await sendInitialMessage();
        }

    } catch (e) {

        const response: IStartTokenErrorResponse = {
            code: 'unable-to-send-email',
            status: "unable-to-send-email",
            message: e.message,
            email,
        };

        ExpressFunctions.sendResponse(res, response);

    }

});
