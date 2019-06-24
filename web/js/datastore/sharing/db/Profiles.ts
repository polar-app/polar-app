import {TagStr} from './Groups';
import {Image} from './Images';
import {Firestore} from '../../../firebase/Firestore';
import {Firebase} from '../../../firebase/Firebase';
import {ProfileOwners} from './ProfileOwners';
import {Preconditions} from '../../../Preconditions';
import * as firebase from '../../../firebase/lib/firebase';
import DocumentReference = firebase.firestore.DocumentReference;

export class Profiles {

    public static readonly COLLECTION = 'profile';

    public static async doc(id: ProfileIDStr): Promise<[HandleStr, DocumentReference]> {
        const firestore = await Firestore.getInstance();
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async get(id: ProfileIDStr): Promise<Profile | undefined> {
        const [_, ref] = await this.doc(id);
        const doc = await ref.get();
        return <Profile> doc.data();
    }


    public static async currentUserProfile(): Promise<Profile | undefined> {

        const app = Firebase.init();
        const user = app.auth().currentUser;

        Preconditions.assertPresent(user, "user");

        const profileOwner = await ProfileOwners.get(user!.uid);

        if (! profileOwner) {
            // getting their user from teh database and writing it back out...

            throw new Error("No profile owner");
        }

        return await this.get(profileOwner.profileID);

    }

}

export interface ProfileInit {

    readonly name?: string;

    /**
     * The image of the user from their profile.
     */
    readonly image?: Image;

    /**
     * The user handle of this profile.  A unique name for this account that's
     * a global reference for this user like 'alice101' or 'burtonator'.
     */
    readonly handle?: string;

    /**
     * User entered bio for their profile.
     */
    readonly bio?: string;

    /**
     * Allow the user to pick at most 5 tags for the document.
     */
    readonly tags?: ReadonlyArray<TagStr>;

    readonly links?: ReadonlyArray<string>;

    /**
     * The physical location for the user.
     */
    readonly location?: string;

}

export interface Profile extends ProfileInit {

    readonly id: ProfileIDStr;

}

export type ProfileIDStr = string;

export type HandleStr = string;

export type UserIDStr = string;

export type EmailStr = string;
