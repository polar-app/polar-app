import {GroupIDStr} from './Groups';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";
import {ProfileIDStr} from "polar-shared/src/util/Strings";
import {Collections} from 'polar-firestore-like/src/Collections';
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import GetOrCreateRecord = Collections.GetOrCreateRecord;

export class GroupMembers {

    public static readonly COLLECTION = 'group_member';

    public static createID(profileID: ProfileIDStr, groupID: GroupIDStr) {
        return Hashcodes.createID({profileID, groupID}, 20);
    }

    public static doc(profileID: ProfileIDStr, groupID: GroupIDStr): [GroupMemberIDStr, IDocumentReference<unknown>] {
        const firestore = FirestoreAdmin.getInstance();
        const id = this.createID(profileID, groupID);
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async deleteByGroupID(batch: IWriteBatch<unknown>,
                                        groupID: GroupIDStr) {
        const firestore = FirestoreAdmin.getInstance();
        await Collections.deleteByID(firestore, this.COLLECTION, batch, () => this.list(groupID));
    }

    public static async delete(batch: IWriteBatch<unknown>,
                               groupID: GroupIDStr,
                               profileID: ProfileIDStr): Promise<boolean> {

        const [id, ref] = this.doc(profileID, groupID);

        const doc = await ref.get();

        if (doc.exists) {
            batch.delete(ref);
        }

        return doc.exists;

    }

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupMember>> {
        const firestore = FirestoreAdmin.getInstance();
        return await Collections.listByFieldValue(firestore, this.COLLECTION, 'groupID', groupID);
    }

    public static async getOrCreate(batch: IWriteBatch<unknown>, groupMemberInit: GroupMemberInit): Promise<GetOrCreateRecord<GroupMember>> {

        const [id, ref] = this.doc(groupMemberInit.profileID, groupMemberInit.groupID);

        const doc = await ref.get();

        if (doc.exists) {
            return {
                created: false,
                record: <GroupMember> doc.data()
            };
        }

        const groupMember: GroupMember = {
            id,
            created: ISODateTimeStrings.create(),
            ...groupMemberInit
        };

        const record = Dictionaries.onlyDefinedProperties(groupMember);
        batch.create(ref, record);

        return {
            created: true,
            record
        };

    }

}

export interface GroupMemberInit {

    readonly profileID: ProfileIDStr;

    readonly groupID: GroupIDStr;

}

export interface GroupMember extends GroupMemberInit {

    /**
     * The ID for this entry.
     */
    readonly id: string;

    readonly created: ISODateTimeString;

}

export type GroupMemberIDStr = string;
