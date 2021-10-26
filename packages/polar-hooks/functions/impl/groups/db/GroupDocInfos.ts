import {Tag} from "polar-shared/src/tags/Tags";
import {ISODateString, ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {GroupIDStr} from "./Groups";
import {Preconditions} from "polar-shared/src/Preconditions";
import {GroupDoc} from "./GroupDocs";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";
import {Collections} from "polar-firestore-like/src/Collections";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import GetOrCreateRecord = Collections.GetOrCreateRecord;

export class GroupDocInfos {

    public static readonly COLLECTION = 'group_doc_info';

    public static createDocumentReference(groupID: GroupIDStr,
                                          fingerprint: DocFingerprintStr): IDocumentReference<unknown> {

        const firestore = FirestoreAdmin.getInstance();

        const id = Hashcodes.create({groupID, fingerprint});

        return firestore.collection(this.COLLECTION).doc(id);

    }

    public static async listByGroupID(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDoc>> {
        Preconditions.assertPresent(groupID, 'groupID');
        const firestore = FirestoreAdmin.getInstance();

        return await Collections.listByFieldValue(firestore, this.COLLECTION, 'groupID', groupID);

    }

    public static async getOrCreate(batch: IWriteBatch<unknown>,
                                    groupDocInfoInit: GroupDocInfoInit): Promise<GetOrCreateRecord<GroupDocInfo>> {

        const firestore = FirestoreAdmin.getInstance();

        const {groupID, fingerprint} = groupDocInfoInit;

        const ref = this.createDocumentReference(groupID, fingerprint);

        const createRecord = () => {

            const record: GroupDocInfo = {
                added: ISODateTimeStrings.create(),
                ...groupDocInfoInit
            };

            return record;

        };

        // TODO: make it so that we increment a nrReaders field.

        return await Collections.getOrCreate(firestore, this.COLLECTION, batch, ref, createRecord);

    }

}

// TODO: move to polar-shared
export interface GroupDocInfoInit {

    /**
     * The group that this doc is associated with.
     */
    readonly groupID: GroupIDStr;

    readonly fingerprint: string;

    readonly title: string;

    readonly subtitle?: string;

    readonly nrPages: number;

    readonly description?: string;

    readonly url?: string;

    // The user tags from this user for their version of this doc.  This
    // excludes special typed tags and folder tags
    readonly tags?: {readonly [id: string]: Tag};

    readonly published?: ISODateTimeString;

    readonly doi?: string;

}

export interface GroupDocInfo extends GroupDocInfoInit {

    /**
     * The time this doc was first added in the group.
     */
    readonly added: ISODateString;

}

export type DocFingerprintStr = string;
