import {ExpressFunctions} from "../util/ExpressFunctions";
import {EmailStr} from "polar-shared/src/util/Strings";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {AuthChallengeCollection} from "polar-firebase/src/firebase/om/AuthChallengeCollection";
import {Challenges} from "polar-shared/src/util/Challenges";
import {Sendgrid} from "polar-sendgrid/src/Sendgrid";
import {IDUser} from "polar-rpc/src/IDUser";
import IChallengeWithParts = Challenges.IChallengeWithParts;

interface IEmailTemplate {
    readonly to: string;
    readonly from: string;
    readonly subject: string;
    readonly html: string;
}

export function createChallenge() {
    return Challenges.create();
}

function createEmailTemplate(email: EmailStr, challenge: IChallengeWithParts): IEmailTemplate {
    const p0 = challenge.p0;
    const p1 = challenge.p1;

    return {
        to: email,
        from: 'noreply@getpolarized.io',
        subject: `Please use code ${p0} ${p1} to finish your account deletion in Polar`,
        html: `<p>Please use the following code in the account page to permanently delete your Polar account:</p>
                   <p><span style="font-size: 30px;"><b>${p0} ${p1}</b></span></p>
                   <p style="font-size: smaller; color: #c6c6c6;">Sent via sendgrid</p>`
    };

}

async function sendEmail(tmpl: IEmailTemplate) {
    await Sendgrid.send(tmpl);
}

export const StartAccountDeleteFunction = ExpressFunctions.createRPCHook('StartAccountDeleteFunction', async (idUser: IDUser) => {
    const email = idUser.user.email;

    const challenge = createChallenge();

    const firestore = FirestoreAdmin.getInstance();
    await AuthChallengeCollection.write(firestore, email, challenge.challenge);

    const tmpl = createEmailTemplate(email, challenge);

    await sendEmail(tmpl);
});
