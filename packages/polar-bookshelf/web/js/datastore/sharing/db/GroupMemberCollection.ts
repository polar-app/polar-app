import {GroupIDStr, ProfileIDStr} from 'polar-shared/src/util/Strings';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {Preconditions} from 'polar-shared/src/Preconditions';

import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {Collections} from "polar-firestore-like/src/Collections";

import DocumentChange = Collections.DocumentChange;


export class GroupMemberCollection {

    public static readonly COLLECTION = 'group_member';

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupMember>> {
        const user = await FirebaseBrowser.currentUserAsync();
        const firestore = await FirestoreBrowserClient.getInstance();

        Preconditions.assertPresent(user, 'user');
        return await Collections.list(firestore, this.COLLECTION, [['groupID' , '==', groupID]]);
    }

    /**
     *
     * Get the members of this group.
     */
    public static async onSnapshot(groupID: GroupIDStr,
                                   delegate: (records: ReadonlyArray<DocumentChange<GroupMember>>) => void) {
        const firestore = await FirestoreBrowserClient.getInstance();

        return await Collections.onQuerySnapshotChanges(firestore, this.COLLECTION, [['groupID' , '==', groupID]], delegate);

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
