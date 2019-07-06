import {UserIDStr} from './Profiles';
import {Firestore} from '../../../firebase/Firestore';
import {GroupIDStr} from '../../Datastore';
import {Firebase} from "../../../firebase/Firebase";
import {Collections} from "./Collections";

export class UserGroups {

    public static readonly COLLECTION = 'user_group';

    public static async get(uid?: UserIDStr): Promise<UserGroup | undefined> {

        if (! uid) {
            const user = await Firebase.currentUser();

            if (! user) {
                return undefined;
            }

            uid = user.uid;

        }

        const firestore = await Firestore.getInstance();

        const ref = firestore.collection(this.COLLECTION).doc(uid);
        const doc = await ref.get();
        const userGroupRaw = <UserGroupRaw> doc.data();

        if (userGroupRaw) {

            return {
                uid: userGroupRaw.uid,
                groups: userGroupRaw.groups || [],
                invitations: userGroupRaw.invitations || [],
                admin: userGroupRaw.admin || [],
                moderator: userGroupRaw.moderator || []
            };

        }

        return undefined;

    }

    public static async onSnapshot(handler: (userGroups: UserGroup | undefined) => void) {

        const user = await Firebase.currentUser();

        return await Collections.onDocumentSnapshot<UserGroup>(this.COLLECTION,
                                                               user!.uid,
                                                               userGroups => handler(userGroups));

    }

    public static async hasPermissionForGroup(groupID: GroupIDStr): Promise<boolean> {

        const userGroup = await UserGroups.get();

        if (! userGroup) {
            return false;
        }

        if (! userGroup.groups.includes(groupID)) {
            return false;
        }

        if (! userGroup.invitations.includes(groupID)) {
            return false;
        }

        return true;

    }


}

export interface UserGroupRaw {
    /**
     * The UID for this record so the user can read their own values.
     */
    readonly uid: UserIDStr;

    readonly groups?: ReadonlyArray<GroupIDStr>;

    readonly invitations?: ReadonlyArray<GroupIDStr>;

    /**
     * The groups in which the user is an admin.
     */
    readonly admin?: ReadonlyArray<GroupIDStr>;

    /**
     * The groups in which the user is a moderator.
     */
    readonly moderator?: ReadonlyArray<GroupIDStr>;

}

/**
 * Just like the UserGroup but it might be possible for the backend to be missing
 * certain fields.
 */
export interface UserGroupInit {

    /**
     * The UID for this record so the user can read their own values.
     */
    readonly uid: UserIDStr;

    readonly groups: ReadonlyArray<GroupIDStr>;

    readonly invitations: ReadonlyArray<GroupIDStr>;

    readonly admin: ReadonlyArray<GroupIDStr>;

    readonly moderator: ReadonlyArray<GroupIDStr>;


}

export interface UserGroup extends UserGroupInit {

}
