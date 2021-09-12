import {GroupIDStr, ProfileIDStr} from 'polar-shared/src/util/Strings';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Collections} from "polar-firestore-like/src/Collections";
import DocumentChange = Collections.DocumentChangeValue;
import { IFirestore } from 'polar-firestore-like/src/IFirestore';


export class GroupMemberCollection {

    public static readonly COLLECTION = 'group_member';

    public static async list(firestore: IFirestore<unknown>, groupID: GroupIDStr): Promise<ReadonlyArray<GroupMember>> {
        return await Collections.list(firestore, this.COLLECTION, [['groupID' , '==', groupID]]);
    }

    /**
     *
     * Get the members of this group.
     */
    public static async onSnapshot<SM = unknown>(firestore: IFirestore<SM>,
                                                 groupID: GroupIDStr,
                                                 delegate: (records: ReadonlyArray<DocumentChange<GroupMember>>) => void) {

        return Collections.onQuerySnapshotChanges<GroupMember, SM>(firestore, this.COLLECTION, [['groupID' , '==', groupID]], delegate);

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
