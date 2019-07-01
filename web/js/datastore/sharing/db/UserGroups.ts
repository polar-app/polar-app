import {UserIDStr} from './Profiles';
import {Firestore} from '../../../firebase/Firestore';
import {GroupIDStr} from '../../Datastore';
import {Firebase} from "../../../firebase/Firebase";
import {Collections} from "./Collections";

export class UserGroups {

    public static readonly COLLECTION = 'user_group';

    public static async get(uid: UserIDStr): Promise<UserGroup | undefined> {

        const firestore = await Firestore.getInstance();

        const ref = firestore.collection(this.COLLECTION).doc(uid);
        const doc = await ref.get();
        return <UserGroup> doc.data();

    }

    public static async onSnapshot(handler: (userGroups: UserGroup | undefined) => void) {

        const user = await Firebase.currentUser();

        return await Collections.onDocumentSnapshot<UserGroup>(this.COLLECTION,
                                                               user!.uid,
                                                               userGroups => handler(userGroups));

    }

}

export interface UserGroupInit {

    /**
     * The UID for this record so the user can read their own values.
     */
    readonly uid: UserIDStr;

    readonly groups: ReadonlyArray<GroupIDStr>;

    readonly invitations: ReadonlyArray<GroupIDStr>;

    /**
     * The groups in which the user is an admin.
     */
    readonly admin: ReadonlyArray<GroupIDStr>;

    /**
     * The groups in which the user is a moderator.
     */
    readonly moderator: ReadonlyArray<GroupIDStr>;

}

export interface UserGroup extends UserGroupInit {

}
