import {GroupIDStr} from './db/Groups';
import {IDUser} from '../util/IDUsers';
import {Firestore} from '../util/Firestore';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {UserRequests} from '../util/UserRequests';
import {GroupLeaves} from './GroupLeaves';
import {UserProfiles} from './db/UserRefs';

export class GroupLeaveFunctions {

    public static async exec(idUser: IDUser,
                             request: GroupLeaveRequest) {

        const firestore = Firestore.getInstance();

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
export const GroupLeaveFunction = ExpressFunctions.createHook('GroupLeaveFunction', (req, res) => {
    return UserRequests.execute(req, res, GroupLeaveFunctions.exec);
});

export interface GroupLeaveRequest {

    readonly groupID: GroupIDStr;

}

