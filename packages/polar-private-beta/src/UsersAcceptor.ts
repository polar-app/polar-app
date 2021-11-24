import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
import {Sendgrid} from "polar-sendgrid/src/Sendgrid";
import {IDUser} from "polar-rpc/src/IDUser";
import {IUserRecord} from 'polar-firestore-like/src/IUserRecord'
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {PrivateBetaReqCollection} from "polar-firebase/src/firebase/om/PrivateBetaReqCollection";

export namespace UsersAcceptor {

    export interface IUsersAcceptorRequest {
        readonly emails: ReadonlyArray<string>,
    }

    export interface IUsersAcceptorResponse {
        readonly accepted: ReadonlyArray<IUserRecord>,
    }

    /**
     * Define a list of users that can invoke this cloud function
     * for accepting users into the private beta
     */
    export function authorized(idUser: IDUser) {
        const allowedEmails = [
            'dzhuneyt@getpolarized.io',
            'jonathan@getpolarized.io',
            'kevin@getpolarized.io',
            'jonathan.graeupner@gmail.com',
        ];
        return allowedEmails.includes(idUser.user.email as string);
    }

    async function sendWelcomeEmail(email: string) {
        const message = {
            to: email,
            from: 'founders@getpolarized.io',
            subject: `Your journey with Polar is ready to begin! 🙌`,
            html: `<p>Welcome to Polar! 🎉🎉 You now have access to Polar and can log in using this email address</p>
                   <p><b><a href="https://getpolarized.io">Click here to get started</a></b></p>
                   <p>Quick note: we would love to hear from you! We are rapidly releasing multiple new features these days. If you have any feedback, send us a message! It helps us improve the tool faster 🙏</p>
                   <p>Cheers</p>
                   <p>The Polar team</p>
                   <p style="font-size: smaller; color: #c6c6c6;">Polar - Read. Learn. Never Forget.</p>`
        };
        await Sendgrid.send(message);
    }

    export const exec = async (idUser: IDUser, request: IUsersAcceptorRequest): Promise<IUsersAcceptorResponse> => {
        if (!authorized(idUser)) {
            throw new Error('Not authorized');
        }

        // eslint-disable-next-line functional/prefer-readonly-type
        const accepted: IUserRecord[] = [];

        const firestore = FirestoreAdmin.getInstance();

        const waitingUsers = await PrivateBetaReqCollection.list(firestore);

        // Check if the list of users are all valid waiting users
        request.emails.forEach(email => {
            const found = waitingUsers.find(waitingUsers => waitingUsers.email === email);

            if (!found) {
                throw new Error(`One of the users to be accepted ${email} does not exist`);
            }
        })

        for (const email of request.emails) {
            const user = await FirebaseUserCreator.create(email, Hashcodes.createRandomID());

            await sendWelcomeEmail(email);

            await PrivateBetaReqCollection.deleteByEmail(firestore, email);

            accepted.push(user);
        }

        return {
            accepted,
        }
    }
}
