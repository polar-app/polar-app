import {Query} from "@google-cloud/firestore";
import {WriteBatch} from "@google-cloud/firestore";
import {EmailStr} from './Profiles';
import {ProfileIDStr} from './Profiles';
import {IDUser} from '../../util/IDUsers';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Firestore} from '../../util/Firestore';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Sets} from 'polar-shared/src/util/Sets';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import {ProfileOwners} from './ProfileOwners';
import {ISODateTimeStrings, ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import * as admin from 'firebase-admin';
import UserRecord = admin.auth.UserRecord;
import {FirestoreTypedArray} from "polar-firebase/src/firebase/Collections";
import {Arrays} from "polar-shared/src/util/Arrays";


export class Contacts {

    public static readonly COLLECTION = 'contact';

    /**
     * Create a deterministic key based on uid and groupID so that we don't
     * have to use an index to determine if we have a group invitation.
     */
    public static createID() {
        return Hashcodes.createRandomID(20);
    }

    public static async createOrUpdate(batch: WriteBatch, idUser: IDUser, contactInit: ContactInit) {

        const getExisting = async () => {

            if (! contactInit.email && ! contactInit.profileID) {
                throw new Error("Must have either email or profileID");
            }

            const functions = [
                () => contactInit.email ? this.getViaEmail(contactInit.email, idUser) : undefined,
                () => contactInit.profileID ? this.getViaProfileID(contactInit.profileID, idUser) : undefined,
            ];

            for (const func of functions) {

                const result = await func();
                if (result) {
                    return result;
                }

            }

            return undefined;

        };

        const createContact = async (): Promise<Contact> => {

            const existing = await getExisting();

            if (existing) {

                const rel = Sets.toArray(Sets.mergedArrays(Arrays.toArray(existing.rel),
                                                           Arrays.toArray(contactInit.rel)));

                return {
                    id: existing.id,
                    uid: existing.uid,
                    profileID: Optional.first(existing.profileID, contactInit.profileID).getOrUndefined(),
                    email: Optional.first(existing.email, contactInit.email).getOrUndefined(),
                    reciprocal: contactInit.reciprocal,
                    created: existing.created,
                    rel
                };

            } else {

                return {
                    id: this.createID(),
                    uid: idUser.uid,
                    created: ISODateTimeStrings.create(),
                    ...contactInit
                };
            }

        };

        /**
         * If the profileID is not present on this email and the user already
         * has an account we should try to add the profileID.
         */
        const resolveProfileID = async (contact: Contact): Promise<Contact> => {

            if (contact.profileID) {
                // we're done here... no contact needed.
                return contact;
            }

            if (! contact.email) {
                throw new Error("No email and no profileID");
            }

            const app = FirebaseAdmin.app();
            const auth = app.auth();

            async function getUserByEmail(email: EmailStr): Promise<UserRecord | undefined> {

                try {
                    return await auth.getUserByEmail(email);
                } catch (e) {
                    console.warn("Unable to lookup user by email: ", e);
                    return undefined;
                }

            }

            const user = await getUserByEmail(contact.email);

            if (! user) {
                // this user has not signed up yet...
                return contact;
            }

            const profileOwner = await ProfileOwners.get(user.uid);

            if (profileOwner) {
                return {profileID: profileOwner.profileID, ...contact};
            } else {
                return contact;
            }

        };

        const contact = await(resolveProfileID(await createContact()));

        const firestore = Firestore.getInstance();

        const ref = firestore.collection(this.COLLECTION).doc(contact.id);

        batch.set(ref, Dictionaries.onlyDefinedProperties(contact));

    }

    public static async getViaEmail(email: EmailStr, idUser: IDUser): Promise<Contact | undefined> {

        const firestore = Firestore.getInstance();

        const query = firestore
            .collection(this.COLLECTION)
            .where('email', '==', email)
            .where('uid', '==' , idUser.uid);

        return await this.firstRecord(query);

    }

    public static async getViaProfileID(profileID: ProfileIDStr, idUser: IDUser): Promise<Contact | undefined> {

        const firestore = Firestore.getInstance();

        const query = firestore
            .collection(this.COLLECTION)
            .where('profileID', '==', profileID)
            .where('uid', '==' , idUser.uid);

        return await this.firstRecord(query);

    }

    private static async firstRecord(query: Query): Promise<Contact | undefined> {

        const snapshot = await query.get();

        if (snapshot.docs.length === 0) {
            return undefined;
        }

        if (snapshot.docs.length === 1) {
            return <Contact> snapshot.docs[0].data();
        }

        throw new Error("Too many records");

    }
}

export interface MutableContactInit {

    profileID?: EmailStr;

    email?: EmailStr;

    /**
     * The label for this contact.  This is either the parsed 'name' that we
     * parsed from the email or it's going to be the profile name from their
     * profile metadata.
     */
    label?: string;

    /**
     * The relationship with this contact.
     */
    rel: ContactRelArray;

    /**
     * True if the user has me as a friend too.
     */
    reciprocal: boolean;

}

export interface ContactInit extends Readonly<MutableContactInit> {


}

export interface Contact extends ContactInit {

    readonly id: string;
    readonly uid: string;
    readonly created: ISODateTimeString;

}

export type ContactRelArray = FirestoreTypedArray<ContactRelType>;

/**
 * The relationship type:
 *
 * - sharing: sharing documents with this user.
 * - friend: added them as a friend.
 *
 */
export type ContactRelType = 'shared' | 'friend';

export type ContactIDStr = string;
