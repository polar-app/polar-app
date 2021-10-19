import {Image} from './Images';
import {TagStr} from "polar-shared/src/tags/Tags";
import {PlainTextStr, URLStr, UserIDStr, ProfileIDStr, HandleStr, EmailStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Arrays} from "polar-shared/src/util/Arrays";
import { Dictionaries } from 'polar-shared/src/util/Dictionaries';
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";
import {ProfileOwnerCollection} from "./ProfileOwnerCollection";
import {
    DocumentReferences,
    CacheFirstThenServerGetOptions,
    IGetOptionsWithOrder
} from "polar-firestore-like/src/DocumentReferences";

export interface IProfileInit {

    readonly id: ProfileIDStr;

    readonly created: ISODateTimeString;

}

export interface IProfileUpdate {

    /**
     * The user's UID which is used when assigning permissions.
     */
    readonly uid: UserIDStr;


    readonly updated: ISODateTimeString;

    /**
     * The user handle of this profile.  A unique name for this account that's
     * a global reference for this user like 'alice101' or 'burtonator'.
     */
    readonly handle: HandleStr;

    /**
     * The primary email for the user.
     */
    readonly email: EmailStr;

    /**
     * All other emails associated with that user.
     */
    readonly emails: ReadonlyArray<EmailStr>;

    /**
     * The name of the user.
     */
    readonly name?: string;

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

export interface IProfile extends IProfileInit, IProfileUpdate {
}

export interface ProfileIDRecord {
    readonly profileID?: ProfileIDStr;
}

export type ProfileRecordTuple<T> = [T, IProfile | undefined];

export namespace ProfileCollection {

    export const COLLECTION = 'profile';

    export function createID() {
        return Hashcodes.createRandomID(20);
    }

    export async function get(firestore: IFirestore<unknown>, id: ProfileIDStr): Promise<IProfile | undefined> {
        return await Collections.get(firestore, COLLECTION, id);
    }

    export async function doc(firestore: IFirestore<unknown>, id: ProfileIDStr): Promise<[string, IDocumentReference<unknown>]> {
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    export async function getWithOpts(firestore: IFirestore<unknown>,
                                      id: ProfileIDStr,
                                      opts: IGetOptionsWithOrder = {}): Promise<IProfile | undefined> {

        const [_, ref] = await doc(firestore, id);
        const docRef = await DocumentReferences.get(ref, opts);
        return <IProfile> docRef.data();

    }

    export async function getByUserID(firestore: IFirestore<unknown>, uid: UserIDStr): Promise<IProfile | undefined> {
        const results = await Collections.list<IProfile>(firestore, COLLECTION, [['uid', '==', uid]]);
        return Arrays.first(results);
    }

    export function set(firestore: IFirestore<unknown>,
                        batch: IWriteBatch<unknown>,
                        id: ProfileIDStr,
                        update: IProfileUpdate) {

        const updated = ISODateTimeStrings.create();

        const ref = firestore.collection(COLLECTION).doc(id);

        batch.set(ref, Dictionaries.onlyDefinedProperties({
            ...update,
            updated
        }), {merge: true});

    }

    export async function doDelete(firestore: IFirestore<unknown>,
                                   batch: IWriteBatch<unknown>,
                                   id: ProfileIDStr) {

        await Collections.deleteByID(firestore, COLLECTION, batch, async () => [{id}] );

    }

    export async function userProfile(firestore: IFirestore<unknown>,
                                      uid: UserIDStr): Promise<IProfile | undefined> {

        if (! uid) {
            return undefined;
        }

        return getByUserID(firestore, uid);

    }


    /**
     * Lookup all the profile IDs.  This is done in parallel for performance reasons.
     */
    export async function resolve<T extends ProfileIDRecord, SM = unknown>(firestore: IFirestore<SM>,profileIDRecords: ReadonlyArray<T>): Promise<ReadonlyArray<ProfileRecordTuple<T>>> {

        // TODO prefer cache-first

        const promises = profileIDRecords.map(current => {

            const handler = async (): Promise<ProfileRecordTuple<T>> => {

                if (current.profileID) {
                    const profile = await get(firestore, current.profileID);
                    return [current, profile];
                } else {
                    return [current, undefined];
                }

            };

            // call the handler but return it as a promise so we can call
            // promise.all below
            return handler();

        });

        const resolved = await Promise.all(promises);
        return resolved.map(current => current);

    }

    export async function currentProfile(firestore: IFirestore<unknown>,
                                         uid: UserIDStr,
                                         opts: IGetOptionsWithOrder = new CacheFirstThenServerGetOptions()): Promise<IProfile | undefined> {


        const profileOwner = await ProfileOwnerCollection.get(firestore, uid, opts);

        if (! profileOwner) {
            // getting their user from the database and writing it back out...
            return undefined;
        }

        const profile = await getWithOpts(firestore, profileOwner.profileID, opts);

        if ( ! profile) {
            return undefined;
        }

        return profile;

    }

}
