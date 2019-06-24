import {ISODateTimeString} from '../../../metadata/ISODateTimeStrings';
import {GroupIDStr} from '../../Datastore';
import {EmailStr} from './Profiles';
import {ProfileIDStr} from './Profiles';
import {Firestore} from '../../../firebase/Firestore';
import {Firebase} from '../../../firebase/Firebase';
import {SnapshotUnsubscriber} from '../../../firebase/Firebase';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {Image} from './Images';
import {Collections} from './Collections';

export class GroupMemberInvitations {

    public static readonly COLLECTION = 'group_member_invitation';

    public static async list(): Promise<ReadonlyArray<GroupMemberInvitation>> {

        const app = Firebase.init();
        const firestore = await Firestore.getInstance();
        const user = app.auth().currentUser;

        const query = firestore
            .collection(this.COLLECTION)
            .where('to', '==', user!.email);

        const snapshot = await query.get();

        return snapshot.docs.map(current => <GroupMemberInvitation> current.data());

    }

    public static async onSnapshot(delegate: (invitations: ReadonlyArray<GroupMemberInvitation>) => void): Promise<SnapshotUnsubscriber> {

        const app = Firebase.init();
        const firestore = await Firestore.getInstance();
        const user = app.auth().currentUser;

        const query = firestore
            .collection(this.COLLECTION)
            .where('to', '==', user!.email);

        return query.onSnapshot(snapshot => {
            delegate(snapshot.docs.map(current => <GroupMemberInvitation> current.data()));
        });

    }

    /**
     * Delete all of the user contacts...
     */
    public static async purge() {
        await Collections.deleteByID(this.COLLECTION, () => this.list());
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

export interface Sender {

    readonly profileID: ProfileIDStr;

    readonly name: string;

    readonly email: string;

    readonly image: Image | null;

}

