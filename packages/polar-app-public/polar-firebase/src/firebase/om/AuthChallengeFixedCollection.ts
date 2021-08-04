import { Preconditions } from "polar-shared/src/Preconditions";
import { FirestoreAdmin } from "polar-firebase-admin/src/FirestoreAdmin";
import { Collections } from "polar-firestore-like/src/Collections";
import { EmailStr } from "polar-shared/src/util/Strings";

/**
 * Support fixed challenge codes by email.
 *
 */
export namespace AuthChallengeFixedCollection {
  export const COLLECTION_NAME = "auth_challenge_fixed";

  export interface IAuthChallengeFixed {
    readonly id: EmailStr;
    readonly email: EmailStr;
    readonly challenge: EmailStr;
  }

  export async function get(
    email: EmailStr
  ): Promise<IAuthChallengeFixed | undefined> {
    Preconditions.assertPresent(email, "email");

    const firestore = FirestoreAdmin.getInstance();
    const id = email;

    return Collections.get(firestore, COLLECTION_NAME, id);
  }
}
