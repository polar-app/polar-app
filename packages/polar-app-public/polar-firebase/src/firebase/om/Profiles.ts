import {Image} from './Images';
import {TagStr} from "polar-shared/src/tags/Tags";
import {PlainTextStr, URLStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";

export interface IProfileInit {

    /**
     * The user's UID which is used when assigning permissions.
     */
    readonly uid: UserIDStr;

    /**
     * The user handle of this profile.  A unique name for this account that's
     * a global reference for this user like 'alice101' or 'burtonator'.
     */
    readonly handle: HandleStr;

    /**
     * The name of the user.
     */
    readonly name: string;

    /**
     * The primary email for the user.
     */
    readonly email: EmailStr;

    /**
     * All other emails associated with that user.
     */
    readonly emails: ReadonlyArray<EmailStr>;

    /**
     * The image of the user from their profile.  We can also cache this on our
     * own so this is the URL metadata we prefer.
     */
    readonly image?: Image;

    /**
     * User entered bio for their profile.  This is text explaining
     */
    readonly bio?: PlainTextStr;

    /**
     * Allow the user to pick at most 5 tags for their profile so people could
     * search for them by tag..
     */
    readonly tags?: ReadonlyArray<TagStr>;

    /**
     * Links for the user (their Twitter account, Facebook profile, etc).
     */
    readonly links?: ReadonlyArray<URLStr>;

    /**
     * The physical location for the user.
     */
    readonly location?: string;

}

export interface IProfile extends IProfileInit {
    readonly id: ProfileIDStr;
}

export type ProfileIDStr = string;

export type HandleStr = string;

export type UserIDStr = string;

export type EmailStr = string;

export interface ProfileIDRecord {
    readonly profileID?: ProfileIDStr;
}

export type ProfileRecordTuple<T> = [T, IProfile | undefined];

export namespace Profiles {

    export const COLLECTION = 'profile';

    export function createID() {
        return Hashcodes.createRandomID(20);
    }

    export async function get(firestore: IFirestore, id: ProfileIDStr): Promise<IProfile | undefined> {
        return await Collections.getByID(firestore, this.COLLECTION, id);
    }

    // export async function set(batch: WriteBatch,
    //                           id: ProfileIDStr,
    //                           user: UserRecord,
    //                           profileInit: ProfileInit) {
    //
    //     const image = Users.createImage(user);
    //
    //     const lastUpdated = ISODateTimeStrings.create();
    //
    //     const profile: Profile = {
    //         id,
    //         image,
    //         lastUpdated,
    //         ...profileInit
    //     };
    //
    //     const firebase = Firestore.getInstance();
    //
    //     const ref = firebase.collection(this.COLLECTION).doc(id);
    //
    //     batch.set(ref, Dictionaries.onlyDefinedProperties(profile));
    //
    // }
    //
    // public static async delete(batch: WriteBatch, id: ProfileIDStr) {
    //     await Collections.deleteByID(batch, this.COLLECTION, async () => [{id}] );
    // }
    //
    // public static async userProfile(uid: UserIDStr): Promise<Profile | undefined> {
    //
    //     if (! uid) {
    //         return undefined;
    //     }
    //
    //     const profileOwner = await ProfileOwners.get(uid);
    //
    //     if (! profileOwner) {
    //         // getting their user from the database and writing it back out...
    //         return undefined;
    //     }
    //
    //     const profile = await this.get(profileOwner.profileID);
    //
    //     if ( ! profile) {
    //         return undefined;
    //     }
    //
    //     return profile;
    //
    // }

}
