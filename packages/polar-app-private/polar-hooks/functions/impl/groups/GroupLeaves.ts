// @NotStale
import {GroupIDStr} from './db/Groups';
import {Groups} from './db/Groups';
import {GroupMembers} from './db/GroupMembers';
import {UserGroups} from './db/UserGroups';
import {GroupDocs} from './db/GroupDocs';
import {GroupDocActions} from './db/GroupDocActions';
import {WriteBatch} from '@google-cloud/firestore';
import {GroupMemberInvitations} from './db/GroupMemberInvitations';
import {UserProfile} from './db/UserRefs';

export class GroupLeaves {

    public static async leave(batch: WriteBatch,
                              groupID: GroupIDStr,
                              userProfile: UserProfile) {

        const profileID = await userProfile.getProfileID();
        const uid = await userProfile.getUserID();
        const email = await userProfile.getEmail();

        if (uid && profileID && await GroupMembers.delete(batch, groupID, profileID)) {

            Groups.incrementNrMembers(batch, groupID, -1);

            UserGroups.deleteByGroupID(batch, uid, groupID);

            // get the docs this user shared with the group
            const groupDocs = await GroupDocs.listByGroupIDAndProfileID(groupID, profileID);

            for (const groupDoc of groupDocs) {
                await GroupDocActions.removeFromGroup(batch, groupID, groupDoc.docID);
            }

        }

        GroupMemberInvitations.delete(batch, email, groupID);

    }

}
