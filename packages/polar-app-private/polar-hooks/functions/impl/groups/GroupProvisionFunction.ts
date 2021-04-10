import {GroupIDStr, GroupInit, GroupInits, Groups} from './db/Groups';
import {GroupAdmins} from './db/GroupAdmins';
import {UserGroups} from './db/UserGroups';
import {Senders} from './db/GroupMemberInvitations';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {IDUser} from '../util/IDUsers';
import {Firestore} from '../util/Firestore';
import {GroupDocActions} from "./db/GroupDocActions";
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {UserRequests} from '../util/UserRequests';
import {TagsValidator} from './rpc/TagsValidator';
import {GroupInvites, UserRefInvitations} from './GroupInvites';
import {UserRefs} from './db/UserRefs';
import {GroupMembers} from "./db/GroupMembers";
import {LinksValidator} from "./rpc/LinksValidator";
import {Arrays} from "polar-shared/src/util/Arrays";
import {TextSerializer} from "polar-html/src/sanitize/TextSerializer";

export class GroupProvisionFunctions {

    // TODO: how do we want to have status codes for errors presented to the
    // user so we can differentiate errors vs strings

    public static async exec(idUser: IDUser,
                             request: GroupProvisionRequest): Promise<GroupProvisionResponse> {

        const {uid, user} = idUser;

        const firestore = Firestore.getInstance();

        async function verifyNonExistingGroup(groupID: GroupIDStr) {

            if (request.name) {
                const group = await Groups.get(groupID);
                if (group) {
                    throw new Error(`Group with name ${request.name} already exists.`);
                }
            }

        }

        const groupID = Groups.createID(idUser, request);

        await verifyNonExistingGroup(groupID);

        const profileID = idUser.profileID;

        const batch = firestore.batch();

        const groupInit: GroupInit = {
            name: request.name,
            visibility: request.visibility,
            description: TextSerializer.serialize(request.description),
            langs: request.langs,
            links: LinksValidator.filter(Arrays.toArray(request.links)),
            tags: TagsValidator.validate(Arrays.toArray(request.tags))
        };

        const group = await Groups.getOrCreate(batch, groupID, groupInit);

        if (! GroupInits.equals(groupInit, Groups.toGroupInit(group))) {
            const msg = "Group init not equivalent to resulting group.";
            console.error(msg, groupInit, group);
            throw new Error(msg);
        }

        await GroupAdmins.getOrCreate(batch, groupID, uid);
        UserGroups.updateOrCreate(batch, idUser, groupID, true);

        const from = Senders.create(user, profileID);

        const invitations = await UserRefs.toInvitations(request.invitations);

        await GroupInvites.invite(batch, idUser, groupID, from, invitations, request.docs);

        // the creator of the group needs to be a member too so that others can discover them
        const groupMemberCreation = await GroupMembers.getOrCreate(batch, {profileID, groupID});
        if (groupMemberCreation.created) {
            Groups.incrementNrMembers(batch, groupID);
        }

        for (const doc of request.docs) {
            // allow people in the group to read this doc...
            await GroupDocActions.addToGroup(batch, idUser, groupID, doc, request.visibility);
        }

        // now commit all the records needed .
        await batch.commit();

        // create the group and make the user admin

        const response: GroupProvisionResponse = {
            id: groupID,
            name: request.name,
        };

        return response;

    }

}

/**
 * Creates or re-provisions a group for document sharing.
 */
export const GroupProvisionFunction = ExpressFunctions.createHook('GroupProvisionFunction', (req, res) => {
    return UserRequests.execute(req, res, GroupProvisionFunctions.exec);
});

export interface GroupProvisionRequest extends GroupInit {

    /**
     * Use a user specific 'key' to compute a groupID rather than using a global
     * name.  They key could be anything as long as it's unique within the users
     * 'namespace'.  This can be used for computing a unique group for a users
     * document that they are sharing.
     */
    readonly key?: string;

    /**
     * Used when we're provisioning a group with an initial set of documents.
     */
    readonly docs: ReadonlyArray<DocRef>;

    /**
     * Invite the users in this set of invitations to a group of users.
     */
    readonly invitations: UserRefInvitations;

}

export interface GroupProvisionResponse {

    readonly id: string;

    /**
     * When using a custom group with a custom name.
     */
    readonly name?: string;

}
