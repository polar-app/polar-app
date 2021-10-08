import {GroupIDStr} from './db/Groups';
import {IDUser} from '../util/IDUsers';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {UserRequests} from '../util/UserRequests';
import {GroupLeaves} from './GroupLeaves';
import {UserProfiles} from './db/UserRefs';
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

export class GroupLeaveFunctions {

    public static async exec(idUser: IDUser,
                             request: GroupLeaveRequest) {

        const firestore = FirestoreAdmin.getInstance();

        const batch = firestore.batch();

        const {groupID} = request;

        const userProfile = await UserProfiles.fromUser(idUser.user);
        await GroupLeaves.leave(batch, groupID, userProfile);

        await batch.commit();

    }

}

/**
 * Leaves a group...
 */
export const GroupLeaveFunction = ExpressFunctions.createHookAsync('GroupLeaveFunction', async (req, res) => {
    return await UserRequests.executeAsync(req, res, GroupLeaveFunctions.exec);
});

export interface GroupLeaveRequest {

    readonly groupID: GroupIDStr;

}

