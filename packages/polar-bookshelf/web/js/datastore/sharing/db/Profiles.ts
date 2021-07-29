import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/Firebase";
import {ProfileOwners} from './ProfileOwners';
import {
    CacheFirstThenServerGetOptions,
    DocumentReferences,
    GetOptions
} from "../../../firebase/firestore/DocumentReferences";
import {
    HandleStr,
    IProfile,
    ProfileIDRecord,
    ProfileIDStr,
    ProfileRecordTuple
} from "polar-firebase/src/firebase/om/ProfileCollection";
import {IDocumentReferenceClient} from "polar-firestore-like/src/IDocumentReference";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

/**
 * @Deprecated migrate to polar-firestore
 */
export class Profiles {

    public static readonly COLLECTION = 'profile';

    public static async doc(id: ProfileIDStr): Promise<[HandleStr, IDocumentReferenceClient]> {
        const firestore = await FirestoreBrowserClient.getInstance();
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async get(id: ProfileIDStr, opts: GetOptions = {}): Promise<IProfile | undefined> {
        const [_, ref] = await this.doc(id);
        const doc = await DocumentReferences.get(ref, opts);
        return <IProfile> doc.data();
    }

    /**
     * Lookup all the profile IDs.  This is done in parallel for performance reasons.
     */
    public static async resolve<T extends ProfileIDRecord>(profileIDRecords: ReadonlyArray<T>): Promise<ReadonlyArray<ProfileRecordTuple<T>>> {

        // TODO prefer cache-first

        const promises = profileIDRecords.map(current => {

            const handler = async (): Promise<ProfileRecordTuple<T>> => {

                if (current.profileID) {
                    const profile = await this.get(current.profileID);
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

    public static async currentProfile(opts: GetOptions = new CacheFirstThenServerGetOptions()): Promise<IProfile | undefined> {

        const app = FirebaseBrowser.init();
        const user = app.auth().currentUser;

        if (! user) {
            return undefined;
        }

        const profileOwner = await ProfileOwners.get(user!.uid, opts);

        if (! profileOwner) {
            // getting their user from the database and writing it back out...
            return undefined;
        }

        const profile = await this.get(profileOwner.profileID, opts);

        if ( ! profile) {
            return undefined;
        }

        return profile;

    }

}

