import {GroupIDStr} from './Groups';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Firestore} from '../../util/Firestore';
import {DocumentReference, WriteBatch} from '@google-cloud/firestore';
import {ProfileIDStr} from './Profiles';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {Collections} from './Collections';
import {GetOrCreateRecord} from './Collections';
import {ISODateTimeStrings, ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';

export class GroupMembers {

    public static readonly COLLECTION = 'group_member';

    public static createID(profileID: ProfileIDStr, groupID: GroupIDStr) {
        return Hashcodes.createID({profileID, groupID}, 20);
    }

    public static doc(profileID: ProfileIDStr, groupID: GroupIDStr): [GroupMemberIDStr, DocumentReference] {
        const firestore = Firestore.getInstance();
        const id = this.createID(profileID, groupID);
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async deleteByGroupID(batch: WriteBatch,
                                        groupID: GroupIDStr) {

        await Collections.deleteByID(batch, this.COLLECTION, () => this.list(groupID));

    }

    public static async delete(batch: WriteBatch,
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
        return await Collections.listByFieldValue(this.COLLECTION, 'groupID', groupID);
    }

    public static async getOrCreate(batch: WriteBatch, groupMemberInit: GroupMemberInit): Promise<GetOrCreateRecord<GroupMember>> {

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
