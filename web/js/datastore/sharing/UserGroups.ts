import {UserIDStr} from './Profiles';
import {Firestore} from '../../firebase/Firestore';
import {GroupIDStr} from './Groups';

export class UserGroups {

    public static readonly COLLECTION = 'user_group';

    public static async get(uid: UserIDStr): Promise<UserGroup> {

        const firestore = await Firestore.getInstance();

        const userGroupRef = firestore.collection(this.COLLECTION).doc(uid);
        const doc = await userGroupRef.get();
        return <UserGroup> doc.data();

    }

}

interface UserGroupInit {

    /**
     * The UID for this record so the user can read their own values.
     */
    readonly uid: UserIDStr;

    readonly groups: ReadonlyArray<GroupIDStr>;

    /**
     * The groups in which the user is an admin.
     */
    readonly admin: ReadonlyArray<GroupIDStr>;

    /**
     * The groups in which the user is a moderator.
     */
    readonly moderator: ReadonlyArray<GroupIDStr>;

}

interface UserGroup extends UserGroupInit {

}
