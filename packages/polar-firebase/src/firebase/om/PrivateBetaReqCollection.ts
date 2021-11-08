import {CollectionNameStr, EmailStr, IDStr, TagStr} from "polar-shared/src/util/Strings";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

export namespace PrivateBetaReqCollection {

    /**
     * Firestore collection where users in the waiting list are stored
     */
    const COLLECTION_NAME: CollectionNameStr = "private_beta_req";

    export interface IPrivateBetaReqInit {

        /**
         * The tags for this user which are usually what is used to invite them.
         */
        readonly tags: ReadonlyArray<TagStr>;

        readonly email: EmailStr;


        /**
         * The challenge, created when this record is created, which is required
         * for them to create an account
         */
        readonly challenge: string;

    }

    export interface IPrivateBetaReq extends IPrivateBetaReqInit {

        readonly id: IDStr;

        readonly created: ISODateTimeString;
        readonly updated: ISODateTimeString;

        /**
         * The time when a user was invited to the beta.  Used so that we don't
         * do a double invite.
         */
        readonly invited?: ISODateTimeString;

    }

    export function createID(email: EmailStr) {
        return Hashcodes.createID(email);
    }

    export async function set<SM = unknown>(firestore: IFirestore<SM>, init: IPrivateBetaReqInit): Promise<IPrivateBetaReq> {

        const now = ISODateTimeStrings.create();

        const doc: IPrivateBetaReq = {
            ...init,
            id: createID(init.email),
            created: now,
            updated: now,
        }

        await Collections.set(firestore, COLLECTION_NAME, doc.id, doc);
        return doc;
    }

    export async function get<SM = unknown>(firestore: IFirestore<SM>, id: IDStr): Promise<IPrivateBetaReq | undefined> {
        return Collections.get(firestore, COLLECTION_NAME, id);
    }

    export async function getByEmail<SM = unknown>(firestore: IFirestore<SM>, email: EmailStr): Promise<IPrivateBetaReq | undefined> {
        return Collections.getByFieldValue(firestore, COLLECTION_NAME, 'email', email);
    }

    export async function list<SM = unknown>(firestore: IFirestore<SM>): Promise<ReadonlyArray<IPrivateBetaReq>> {
        return Collections.list<IPrivateBetaReq>(firestore, COLLECTION_NAME, []);
    }

    export async function deleteByEmail<SM = unknown>(firestore: IFirestore<SM>, email: EmailStr): Promise<void> {
        const single = await getByEmail(firestore, email);
        if (!single) {
            throw new Error(`Can not delete single user because the email was not found: ${email}`);
        }
        return Collections.doDelete<SM>(firestore, COLLECTION_NAME, single.id);
    }

}
