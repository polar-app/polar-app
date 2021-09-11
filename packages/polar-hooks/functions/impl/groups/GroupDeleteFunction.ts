import {Groups} from './db/Groups';
import {IDUser} from '../util/IDUsers';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {UserRequests} from '../util/UserRequests';
import {GroupDeletes, GroupDeleteRequest} from "./GroupDeletes";

export class GroupDeleteFunctions {

    public static async exec(idUser: IDUser,
                             request: GroupDeleteRequest) {

        const {groupID} = request;

        // verify that the user who initiated this request can delete
        await Groups.verifyAdmin(idUser.user, groupID);

        await GroupDeletes.exec(request.groupID, idUser.uid);

    }

}

/**
 * Deletes a group but only if the user is admin on the group.
 */
export const GroupDeleteFunction = ExpressFunctions.createHook('GroupDeleteFunction', (req, res) => {
    return UserRequests.execute(req, res, GroupDeleteFunctions.exec);
});
