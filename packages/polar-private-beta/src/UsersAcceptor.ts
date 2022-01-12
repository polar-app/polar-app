import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
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
            'burton@getpolarized.io',
            'jonathan.graeupner@gmail.com',
            'jwalkenhorst.social@gmail.com',
            'anas@getpolarized.io',
        ];
        return allowedEmails.includes(idUser.user.email as string);
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

            const waitingUserRequest = waitingUsers.find(waitingUser => waitingUser.email === email)!;

            // TODO: I think this is not the best algorithm for finding the
            // referral tag if there are multiple.  We should probably pick the
            // earliest used or some other intelligent algorithm
            const referral_code = waitingUserRequest.tags.find(() => true);

            const user = await FirebaseUserCreator.create(email, Hashcodes.createRandomID(), referral_code);

            await PrivateBetaReqCollection.deleteByEmail(firestore, email);


            accepted.push(user);

        }

        return {
            accepted,
        }
    }
}
