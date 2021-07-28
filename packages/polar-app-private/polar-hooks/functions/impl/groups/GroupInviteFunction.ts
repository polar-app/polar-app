import {GroupIDRef, GroupIDRefs, Groups} from './db/Groups';
import {Senders} from './db/GroupMemberInvitations';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {IDUser} from '../util/IDUsers';
import {UserRequests} from '../util/UserRequests';
import {GroupInvites, UserRefInvitations} from './GroupInvites';
import {UserRefs} from './db/UserRefs';
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

export class GroupInviteFunctions {

    public static async exec(idUser: IDUser,
                             request: GroupInviteRequest): Promise<GroupInviteResponse> {

        const {uid, user, profile} = idUser;

        if (! profile) {
            throw new Error("No profile");
        }

        const firestore = FirestoreAdmin.getInstance();

        const groupID = GroupIDRefs.toID(idUser, request);

        await Groups.verifyAdmin(user, groupID);

        // TODO: do we need verifyAccess here too? I dont' think so.
        await Groups.verifyAccess(uid, groupID);

        const batch = firestore.batch();

        const from = Senders.create(user, profile.id);

        const invitations = await UserRefs.toInvitations(request.invitations);

        await GroupInvites.invite(batch, idUser, groupID, from, invitations);

        await batch.commit();

        return {id: groupID};

    }

}

/**
 * Creates or re-provisions a group for document sharing.
 */
export const GroupInviteFunction = ExpressFunctions.createHook('GroupInviteFunction', (req, res) => {
    return UserRequests.execute(req, res, GroupInviteFunctions.exec);
});

export interface GroupInviteRequest extends GroupIDRef {

    /**
     * Invite the users in this set of invitations to a group of users.
     */
    readonly invitations: UserRefInvitations;

}

interface GroupInviteResponse {

    readonly id: string;

}

