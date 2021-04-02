import {GroupIDStr, Groups} from "./db/Groups";
import {Firestore} from "../util/Firestore";
import {GroupDocs} from "./db/GroupDocs";
import {GroupDocActions} from "./db/GroupDocActions";
import {GroupMembers} from "./db/GroupMembers";
import {GroupAdmins} from "./db/GroupAdmins";
import {GroupMemberInvitations} from "./db/GroupMemberInvitations";
import {UserGroups} from "./db/UserGroups";
import {UserIDStr} from "./db/Profiles";

export class GroupDeletes {

    public static async exec(groupID: GroupIDStr, uid: UserIDStr | undefined) {

        const firestore = Firestore.getInstance();

        // TODO: I think this is better as a transaction now that we have to do
        // a READ within it ... but I need to research this more.
        const batch = firestore.batch();

        const groupDocs = await GroupDocs.listByGroupID(groupID);

        for (const groupDoc of groupDocs) {
            await GroupDocActions.removeFromGroup(batch, groupID, groupDoc.docID);
        }

        Groups.delete(batch, groupID);
        await GroupMembers.deleteByGroupID(batch, groupID);
        GroupAdmins.delete(batch, groupID);
        await GroupDocs.deleteByGroupID(batch, groupID);
        await GroupMemberInvitations.deleteByGroupID(batch, groupID);

        if (uid) {

            // FIXME: this is actually wrong.. the user who deleted this has it
            // deleted but not for all users. The problem here is that doing this
            // in a cloud function could take a long time for a large number of
            // groups.  We might want to just resolve this in the client.
            UserGroups.deleteByGroupID(batch, uid, groupID);

        }

        // TODO each user who had shared this doc with the group now has a
        // dangling groupID that needs to be pruned but this is fine as we
        // can see that it's deleted by the fact that we couldn't read the
        // group records.

        await batch.commit();

    }

}

export interface GroupDeleteRequest {
    readonly groupID: GroupIDStr;
}

