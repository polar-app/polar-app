import {GroupIDStr} from './Groups';
import {Firestore} from '../../../firebase/Firestore';
import {ISODateTimeString} from '../../../metadata/ISODateTimeStrings';
import {ProfileIDStr} from './Profiles';

export class GroupMembers {

    public static readonly COLLECTION = 'group_member';

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupMember>> {

        const firestore = await Firestore.getInstance();

        const query = firestore
            .collection(this.COLLECTION)
            .where('groupID', '==', groupID);

        const snapshot = await query.get();

        return snapshot.docs.map(current => <GroupMember> current.data());

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
