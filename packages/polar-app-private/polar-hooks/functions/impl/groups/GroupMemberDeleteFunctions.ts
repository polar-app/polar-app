import {GroupIDStr, Groups} from './db/Groups';
import {IDUser} from '../util/IDUsers';
import {Firestore} from '../util/Firestore';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {UserRequests} from '../util/UserRequests';
import {GroupLeaves} from './GroupLeaves';
import {UserProfiles} from './db/UserRefs';
import {UserRef} from './db/UserRefs';

/**
 * Allow and admin to force delete a member from a group.
 */
export class GroupMemberDeleteFunctions {

    public static async exec(idUser: IDUser,
                             request: GroupMemberDeleteRequest) {

        const {groupID} = request;
        await Groups.verifyAdmin(idUser.user, groupID);

        const firestore = Firestore.getInstance();

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
export const GroupMemberDeleteFunction = ExpressFunctions.createHook('GroupMemberDeleteFunction', (req, res) => {
    return UserRequests.execute(req, res, GroupMemberDeleteFunctions.exec);
});

export interface GroupMemberDeleteRequest {

    readonly groupID: GroupIDStr;

    readonly userRefs: ReadonlyArray<UserRef>;

}
