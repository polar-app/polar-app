import {GroupIDStr, Groups} from './db/Groups';
import {IDUser} from '../util/IDUsers';
import {GroupMemberInvitations} from './db/GroupMemberInvitations';
import {GroupMembers} from './db/GroupMembers';
import {ProfileOwners} from './db/ProfileOwners';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {UserGroups} from './db/UserGroups';
import {Contacts} from './db/Contacts';
import {GroupDocActions} from "./db/GroupDocActions";
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {UserRequests} from '../util/UserRequests';
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

export class GroupJoinFunctions {

    public static async exec(idUser: IDUser,
                             request: GroupJoinRequest) {

        const {uid} = idUser;

        // we first have to make sure we can join this group.
        const groupMemberVerification = await GroupMemberInvitations.verifyGroupPermissions(idUser.user, request.groupID);

        const {group, groupMemberInvitation} = groupMemberVerification;

        const firestore = FirestoreAdmin.getInstance();

        const batch = firestore.batch();

        if (groupMemberInvitation) {

            const [_, groupMemberInvitationRef] = GroupMemberInvitations.doc(idUser.user.email!, request.groupID);
            batch.delete(groupMemberInvitationRef);

            const {from} = groupMemberInvitation!;

            await Contacts.createOrUpdate(batch, idUser, {
                profileID: from.profileID,
                rel: ['shared'],
                reciprocal: true
            });

        }

        for (const doc of request.docs || []) {
            // add my docs to the group if they are specified...
            await GroupDocActions.addToGroup(batch, idUser, request.groupID, doc, group.visibility);
        }

        const profileOwner = await ProfileOwners.get(uid);

        if (! profileOwner) {
            throw new Error("No profile");
        }

        const groupMemberRecord = await GroupMembers.getOrCreate(batch, {
            profileID: profileOwner.profileID,
            groupID: request.groupID,
        });

        if (groupMemberRecord.created) {
            Groups.incrementNrMembers(batch, request.groupID);
        }

        UserGroups.updateOrCreate(batch, idUser, request.groupID);

        await batch.commit();

    }

}

/**
 * Joins a group...
 */
export const GroupJoinFunction = ExpressFunctions.createHookAsync('GroupJoinFunction', async (req, res) => {
    return await UserRequests.executeAsync(req, res, GroupJoinFunctions.exec);
});

export interface GroupJoinRequest {
    readonly groupID: GroupIDStr;

    /**
     * Used when joining a group and adding my own docs.  This might need to be
     * called multiple times. When the metadata updates, or when when the new
     * document has been annotated as it doesn't make sense to add empty
     * documents.
     */
    readonly docs?: ReadonlyArray<DocRef>;

}

