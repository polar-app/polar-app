import {GroupIDStr, Groups} from './db/Groups';
import {IDUser} from '../util/IDUsers';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {UserRequests} from '../util/UserRequests';
import {GroupLeaves} from './GroupLeaves';
import {UserProfiles, UserRef} from './db/UserRefs';
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

/**
 * Allow and admin to force delete a member from a group.
 */
export class GroupMemberDeleteFunctions {

    public static async exec(idUser: IDUser,
                             request: GroupMemberDeleteRequest) {

        const {groupID} = request;
        await Groups.verifyAdmin(idUser.user, groupID);

        const firestore = FirestoreAdmin.getInstance();

        const batch = firestore.batch();

        for (const userRef of request.userRefs) {

            const userProfile = await UserProfiles.fromUserRef(userRef);
            await GroupLeaves.leave(batch, groupID, userProfile);

        }

        await batch.commit();

    }

}

/**
 * Leaves a group...
 */
export const GroupMemberDeleteFunction = ExpressFunctions.createHookAsync('GroupMemberDeleteFunction', async (req, res) => {
    return await UserRequests.executeAsync(req, res, GroupMemberDeleteFunctions.exec);
});

export interface GroupMemberDeleteRequest {

    readonly groupID: GroupIDStr;

    readonly userRefs: ReadonlyArray<UserRef>;

}
