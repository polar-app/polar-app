import {URLStr} from '../../util/Strings';
import {Firestore} from '../../firebase/Firestore';
import {ISODateTimeStrings} from '../../metadata/ISODateTimeStrings';
import {Hashcodes} from '../../Hashcodes';
import {FirebaseDatastore} from '../FirebaseDatastore';
import * as firebase from '../../firebase/lib/firebase';

const COLLECTION_NAME = 'shared_url';

export class SharedURLs {

    private static firestore?: firebase.firestore.Firestore;

    /**
     * Create a new shared URL which includes a download token which can be
     * shared publicly.
     */
    public static async issue(internalURL: URLStr): Promise<SharedURL> {

        const downloadToken = DownloadTokens.createToken();

        const sharedURL = `https://us-central1-polar-cors.cloudfunctions.net/fetch/?downloadToken=${downloadToken}`;

        const sharedURLRecord: SharedURLRecord = {
            internalURL,
            downloadToken,
            sharedURL
        };

        const id = downloadToken;

        const firestore = await this.getFirestore();

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        await ref.set(sharedURLRecord);

        return sharedURL;
    }

    /**
     * Resolve a downloadToken to the internalURL.
     */
    public static async resolve(downloadToken: DownloadToken): Promise<SharedURLRecord | undefined> {

        const firestore = await this.getFirestore();

        const id = downloadToken;

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        const doc = await ref.get();

        if (doc.exists) {
            return <SharedURLRecord> doc.data();
        }

        return undefined;

    }

    public static async revoke(downloadToken: DownloadToken) {

        const firestore = await this.getFirestore();

        const id = downloadToken;

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        await ref.delete();

    }

    public static parse(sharedURL: SharedURL): SharedURLMeta {
        const parsedURL = new URL(sharedURL);

        const downloadToken = parsedURL.searchParams.get('downloadToken');

        if (downloadToken) {
            return {downloadToken, sharedURL};
        }

        throw new Error("Not a shared URL: " + sharedURL);

    }

    private static async getFirestore(): Promise<firebase.firestore.Firestore> {

        if (this.firestore) {
            return this.firestore;
        } else {
            this.firestore = await Firestore.getInstance();
            return this.firestore!;
        }


    }

}

type SharedURL = string;

interface SharedURLMeta {
    readonly sharedURL: SharedURL;
    readonly downloadToken: DownloadToken;
}

interface SharedURLRecord extends SharedURLMeta {
    readonly internalURL: URLStr;
}

/**
 * Maintains a system of tokens that user scan use to share internal Polar URLs
 * with other people without revealing the actual URL.
 */
class DownloadTokens {

    /**
     * Create an ID that we hand out that we can revoke later if we want.
     */
    public static createToken(): DownloadToken {

        const uid = FirebaseDatastore.getUserID();

        const timestamp = ISODateTimeStrings.create();

        const rand = Math.floor(Math.random() * 1000000);
        const hashcodeData = {uid, timestamp, rand};

        return Hashcodes.createID(hashcodeData, 20);

    }

}

type DownloadToken = string;

/**
 * A team string of team:foo where 'foo' is the name of the team
 */
type TeamStr = string;

type EmailStr = string;

type SharingRole = 'public';

type RecipientTeam = string;

