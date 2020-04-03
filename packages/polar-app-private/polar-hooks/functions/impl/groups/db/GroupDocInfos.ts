import {DocumentReference, WriteBatch} from "@google-cloud/firestore";
import {Firestore} from "../../util/Firestore";
import {Tag} from "polar-shared/src/tags/Tags";
import {ISODateString, ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Collections, GetOrCreateRecord} from "./Collections";
import {GroupIDStr} from "./Groups";
import {Preconditions} from "polar-shared/src/Preconditions";
import {GroupDoc} from "./GroupDocs";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

export class GroupDocInfos {

    public static readonly COLLECTION = 'group_doc_info';

    public static createDocumentReference(groupID: GroupIDStr,
                                          fingerprint: DocFingerprintStr): DocumentReference {
        const firestore = Firestore.getInstance();

        const id = Hashcodes.create({groupID, fingerprint});

        return firestore.collection(this.COLLECTION).doc(id);

    }

    public static async listByGroupID(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDoc>> {
        Preconditions.assertPresent(groupID, 'groupID');

        return await Collections.listByFieldValue(this.COLLECTION, 'groupID', groupID);
    }

    public static async getOrCreate(batch: WriteBatch,
                                    groupDocInfoInit: GroupDocInfoInit): Promise<GetOrCreateRecord<GroupDocInfo>> {

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

        return await Collections.getOrCreate(batch, ref, createRecord);

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
    readonly tags?: {[id: string]: Tag};

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
