import {Preconditions} from "polar-shared/src/Preconditions";
import {Collections} from "polar-firestore-like/src/Collections";
import {EmailStr} from "polar-shared/src/util/Strings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";

/**
 * Support fixed challenge codes by email.
 *
 */
export namespace AuthChallengeFixedCollection {

    export const COLLECTION_NAME = 'auth_challenge_fixed';

    export interface IAuthChallengeFixed {
        readonly id: EmailStr;
        readonly email: EmailStr;
        readonly challenge: EmailStr;
    }

    export async function get<SM = unknown>(firestore: IFirestore<SM>, email: EmailStr): Promise<IAuthChallengeFixed | undefined> {

        Preconditions.assertPresent(email, 'email');

        const id = email;

        return Collections.get<IAuthChallengeFixed, SM>(firestore, COLLECTION_NAME, id)

    }

}
