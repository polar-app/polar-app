import {ISODateTimeString} from '../../metadata/ISODateTimeStrings';
import {DocRef} from './GroupProvisions';
import {Sender} from '../firebase/DocPeerPendings';
import {GroupIDStr} from './Groups';
import {EmailStr} from './Profiles';
import {Firestore} from '../../firebase/Firestore';
import {Firebase} from '../../firebase/Firebase';

export class GroupMemberInvitations {

    public static readonly COLLECTION = 'group_member_invitation';

    public static async list(): Promise<ReadonlyArray<GroupMemberInvitation>> {

        const firestore = await Firestore.getInstance();

        const app = Firebase.init();
        const user = app.auth().currentUser;

        const query = firestore
            .collection(this.COLLECTION)
            .where('to', '==', user!.email);

        const snapshot = await query.get();

        return snapshot.docs.map(current => <GroupMemberInvitation> current.data());

    }

}


export interface GroupMemberInvitationInit {

    readonly groupID: GroupIDStr;

    readonly to: EmailStr;

    readonly message: string;

    /**
     * We have to keep the sender so that when we go to accept the doc we
     * actually know who it's from.
     */
    readonly from: Sender;

    /**
     * The actual DocID we're working with.
     */
    readonly docs: ReadonlyArray<DocRef>;

}

export interface GroupMemberInvitation extends GroupMemberInvitationInit {

    /**
     * The ID for this entry.
     */
    readonly id: string;

    readonly created: ISODateTimeString;
}

