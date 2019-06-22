import {UserIDStr} from './Profiles';
import {Firestore} from '../../../firebase/Firestore';
import {GroupIDStr} from '../../Datastore';

export class UserGroups {

    public static readonly COLLECTION = 'user_group';

    public static async get(uid: UserIDStr): Promise<UserGroup | undefined> {

        const firestore = await Firestore.getInstance();

        const userGroupRef = firestore.collection(this.COLLECTION).doc(uid);
        const doc = await userGroupRef.get();
        return <UserGroup> doc.data();

    }

}

export interface UserGroupInit {

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

export interface UserGroup extends UserGroupInit {

}
