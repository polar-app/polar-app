import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {TagStr} from './Groups';
import * as admin from 'firebase-admin';
import {Image, Users} from './Users';
import {WriteBatch} from '@google-cloud/firestore';
import {Firestore} from '../../util/Firestore';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {Collections} from './Collections';
import {ISODateTimeStrings, ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {ProfileOwners} from "./ProfileOwners";
import UserRecord = admin.auth.UserRecord;
import {FirestoreTypedArray} from "polar-firebase/src/firebase/Collections";

/**
 * Metadata index about a profile to allow anyone to read a profile by profileID
 * including their name, description, image, etc.
 *
 * The Profile ID is just a random ID so that there can be no mapping of email
 * addresses or user IDs that we can't control.
 *
 * The profile optionally has a handle that we can use.
 *
 * profileID => profile
 *
 */
export class Profiles {

    public static readonly COLLECTION = 'profile';

    public static createID() {
        return Hashcodes.createRandomID(20);
    }

    public static async get(id: ProfileIDStr): Promise<Profile | undefined> {
        return await Collections.getByID(this.COLLECTION, id);
    }

    public static set(batch: WriteBatch,
                      id: ProfileIDStr,
                      user: UserRecord,
                      profileInit: ProfileInit) {

        const image = Users.createImage(user);

        const lastUpdated = ISODateTimeStrings.create();

        const profile: Profile = {
            id,
            image,
            lastUpdated,
            ...profileInit
        };

        const firebase = Firestore.getInstance();

        const ref = firebase.collection(this.COLLECTION).doc(id);

        batch.set(ref, Dictionaries.onlyDefinedProperties(profile));

    }

    public static async delete(batch: WriteBatch, id: ProfileIDStr) {
        await Collections.deleteByID(batch, this.COLLECTION, async () => [{id}] );
    }

    public static async userProfile(uid: UserIDStr): Promise<Profile | undefined> {

        if (! uid) {
             return undefined;
        }

        const profileOwner = await ProfileOwners.get(uid);

        if (! profileOwner) {
            // getting their user from the database and writing it back out...
            return undefined;
        }

        const profile = await this.get(profileOwner.profileID);

        if ( ! profile) {
            return undefined;
        }

        return profile;

    }

}

export interface ProfileBase {

    /**
     * The image of the user from their profile.
     */
    readonly image?: Image;

    /**
     * User entered bio for their profile.
     */
    readonly bio?: string;

    /**
     * Allow the user to pick at most 5 tags for their profile.
     */
    readonly tags?: FirestoreTypedArray<TagStr>;

    readonly links?: FirestoreTypedArray<string>;

    /**
     * The physical location for the user.
     */
    readonly location?: string;

}


export interface ProfileInit extends ProfileBase {

    readonly name?: string;

    /**
     * The user handle of this profile.  A unique name for this account that's
     * a global reference for this user like 'alice101' or 'burtonator'.
     */
    readonly handle?: ProfileHandleStr;

}

export type ProfileHandleStr = string;

export interface Profile extends ProfileInit {

    readonly id: ProfileIDStr;

    readonly lastUpdated: ISODateTimeString;

}

export type ProfileIDStr = string;

export type HandleStr = string;

export type UserIDStr = string;

export type EmailStr = string;

export type UserProfileProvider = (uid: UserIDStr) => Promise<Profile | undefined>;

export const defaultUserProfileProvider = async (uid: UserIDStr) => await Profiles.userProfile(uid);
