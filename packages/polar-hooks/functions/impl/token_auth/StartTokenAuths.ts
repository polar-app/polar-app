import {Sendgrid} from "polar-sendgrid/src/Sendgrid";
import {Mailgun} from "../Mailgun";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {AuthChallengeCollection} from "polar-firebase/src/firebase/om/AuthChallengeCollection";
import {UserRecord} from "firebase-functions/lib/providers/auth";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Lazy} from "polar-shared/src/util/Lazy";
import {EmailStr} from "polar-shared/src/util/Strings";
import {AuthChallengeFixedCollection} from "polar-firebase/src/firebase/om/AuthChallengeFixedCollection";
import {Challenges} from "polar-shared/src/util/Challenges";

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

export namespace StartTokenAuths {

    export interface IStartTokenAuthRequest {
        readonly email: string;
        readonly resend?: boolean | string;
    }

    type ERROR_CODE_GENERIC_ERROR = 'unable-to-send-email';
    type ERROR_CODE_REGISTRATIONS_DISABLED = 'registrations-disabled';

    export interface IStartTokenErrorResponse {
        readonly code: ERROR_CODE_GENERIC_ERROR | ERROR_CODE_REGISTRATIONS_DISABLED;
        readonly status: ERROR_CODE_GENERIC_ERROR | ERROR_CODE_REGISTRATIONS_DISABLED;
        readonly message: string;
        readonly email: string;
    }

    export interface IStartTokenAuthResponse {
        readonly code: 'ok';
        readonly status: 'ok';
    }

    export type MailProvider = 'sendgrid' | 'mailgun';

    import IAuthChallenge = AuthChallengeCollection.IAuthChallenge;

    interface IChallenge {
        readonly challenge: string;
    }

    async function createOrFetchChallenge(email: EmailStr): Promise<IChallenge> {

        const firestore = FirestoreAdmin.getInstance();
        const fixed = await AuthChallengeFixedCollection.get(firestore, email);

        if (fixed) {
            return {challenge: fixed.challenge};
        }

        return Challenges.create();

    }


    export async function startTokenAuth(request: IStartTokenAuthRequest): Promise<IStartTokenAuthResponse | IStartTokenErrorResponse> {

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
                subject: `Please use code ${p0} ${p1} to sign in to Polar`,
                html: `<p>Please use the following code to sign in to Polar:</p>
                   <p><span style="font-size: 30px;"><b>${p0} ${p1}</b></span></p>
                   <p style="font-size: smaller; color: #c6c6c6;">Sent via ${provider}</p>`
            };

        }

        function createResponseOK() {

            return <IStartTokenAuthResponse> {
                code: 'ok',
                status: "ok"
            };

        }

        async function sendMailWithProvider(message: IEmailTemplate,
                                            provider: MailProvider) {

            switch (provider) {

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

            console.log(`Send 'initial' with provider: ${provider}`);

            return createResponseOK();

        }

        async function resendMessage() {

            const firestore = FirestoreAdmin.getInstance();
            const challenge = await AuthChallengeCollection.get(firestore, email);

            if (!challenge) {
                throw new Error("No previous challenge sent");
            }

            const provider = 'mailgun';

            const tmpl = createEmailTemplate(challenge, provider);

            await sendMailWithProvider(tmpl, provider);

            console.log(`Send 'resend' with provider: ${provider}`);

            return createResponseOK();

        }

        async function fetchUserByEmail(email: string): Promise<UserRecord | undefined> {

            try {
                const firebase = firebaseProvider();
                const auth = firebase.auth();
                return await auth.getUserByEmail(email);
            } catch (err) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((err as any).code === 'auth/user-not-found') {
                    return undefined;
                }
                throw err;
            }

        }

        try {

            const authUser = await fetchUserByEmail(email);

            if (!authUser) {

                // User not found, attempt to self-register fails here because Private Beta is enabled
                const response: IStartTokenErrorResponse = {
                    code: "registrations-disabled",
                    status: "registrations-disabled",
                    message: 'User does not exist. Please register for the Private Beta',
                    email,
                };

                return response;
            }

            if (resend === true || resend === 'true') {
                return await resendMessage();
            } else {
                return await sendInitialMessage();
            }

        } catch (e) {

            const response: IStartTokenErrorResponse = {
                code: 'unable-to-send-email',
                status: "unable-to-send-email",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message: (e as any).message || undefined,
                email,
            };

            return response;

        }

    }

}
