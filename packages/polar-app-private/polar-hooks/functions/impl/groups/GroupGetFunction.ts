import {Groups} from './db/Groups';
import {Group} from './db/Groups';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {IDUser} from '../util/IDUsers';
import {UserRequests} from '../util/UserRequests';
import {GroupMembers} from './db/GroupMembers';
import {GroupMember} from './db/GroupMembers';
import {GroupMemberInvitations} from './db/GroupMemberInvitations';
import {GroupMemberInvitation} from './db/GroupMemberInvitations';
import {GroupIDRequest} from './db/Groups';

export class GroupGetFunctions {

    public static async exec(idUser: IDUser,
                             request: GroupGetRequest): Promise<GroupGetResponse> {

        const {uid} = idUser;
        const groupID = Groups.createID(idUser, request);

        const group = await Groups.verifyAccess(uid, groupID);

        if (group) {

            const members = await GroupMembers.list(groupID);
            const invitations = await GroupMemberInvitations.list(groupID);

            return {
                result: {
                    group,
                    members: members || [],
                    invitations: invitations || []
                }
            };

        }

        return {};

    }

}

/**
 * Creates or re-provisions a group for document sharing.
 */
export const GroupGetFunction = ExpressFunctions.createHook('GroupGetFunction', (req, res) => {
    return UserRequests.execute(req, res, GroupGetFunctions.exec);
});

export interface GroupGetRequest extends GroupIDRequest {

}

export interface GroupGetResponse {
    readonly result?: GroupResult;
}

export interface GroupResult {
    readonly group: Group;
    readonly members: ReadonlyArray<GroupMember>;
    readonly invitations: ReadonlyArray<GroupMemberInvitation>;
}
