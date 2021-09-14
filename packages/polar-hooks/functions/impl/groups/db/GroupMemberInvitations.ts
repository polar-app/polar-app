import * as admin from 'firebase-admin';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Group, GroupIDStr, Groups} from './Groups';
import {Image} from './Users';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {UserGroups} from './UserGroups';
import {Arrays} from "polar-shared/src/util/Arrays";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";
import {Collections} from "polar-firestore-like/src/Collections";
import {EmailStr, ProfileIDStr} from "polar-shared/src/util/Strings";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import UserRecord = admin.auth.UserRecord;

export class GroupMemberInvitations {

    public static readonly COLLECTION = 'group_member_invitation';

    /**
     * Create a deterministic key based on uid and groupID so that we don't have
     * to use an index to determine if we have a group invitation.
     */
    public static createID(to: EmailStr, groupID: GroupIDStr) {
        return Hashcodes.createID({to, groupID}, 20);
    }

    public static doc(to: EmailStr, groupID: GroupIDStr): [GroupMemberInvitationIDStr, IDocumentReference<unknown>] {
        const firestore = FirestoreAdmin.getInstance();
        const id = this.createID(to, groupID);
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async get(email: EmailStr, groupID: GroupIDStr): Promise<GroupMemberInvitation | undefined> {
        const [_, ref] = this.doc(email, groupID);
        const doc = await ref.get();
        return <GroupMemberInvitation> doc.data();
    }

    public static delete(batch: IWriteBatch<unknown>, email: EmailStr, groupID: GroupIDStr) {
        const [_, ref] = this.doc(email, groupID);
        batch.delete(ref);
    }

    public static create(batch: IWriteBatch<unknown>, invitation: GroupMemberInvitationInit) {

        const [id, ref] = this.doc(invitation.to, invitation.groupID);

        const created = ISODateTimeStrings.create();

        const record: GroupMemberInvitation = {...invitation, id, created};

        batch.create(ref, Dictionaries.onlyDefinedProperties(record));

    }

    public static async getByGroupIDAndTo(groupID: GroupIDStr, to: EmailStr): Promise<GroupMemberInvitation | undefined> {
        const firestore = FirestoreAdmin.getInstance();

        return await Collections.getByFieldValues(firestore, this.COLLECTION, [
            ['groupID', '==', groupID],
            ['to', '==', to]
        ]);
    }

    public static async deleteByGroupID(batch: IWriteBatch<unknown>,
                                        groupID: GroupIDStr) {
        const firestore = FirestoreAdmin.getInstance();

        await Collections.deleteByID(firestore, this.COLLECTION, batch, () => this.list(groupID));

    }

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupMemberInvitation>> {
        const firestore = FirestoreAdmin.getInstance();

        return await Collections.listByFieldValue(firestore, this.COLLECTION, 'groupID', groupID);
    }

    /**
     * Verify that we can work with this group.  Either we're a member or it's
     * public or protected.
     */
    public static async verifyGroupPermissions(user: UserRecord,
                                               groupID: GroupIDStr): Promise<GroupMemberVerification> {

        const group = await Groups.get(groupID);

        if (! group) {
            throw new Error("Group with ID does not exist: " + groupID);
        }

        const userGroups = await UserGroups.get(user.uid);

        if (userGroups) {

            if (Arrays.toArray(userGroups.groups).includes(groupID)) {
                return {group, membership: 'member'};
            }

        }

        if (['protected', 'public'].includes(group.visibility)) {
            // if the group is public or protected we allow anyone to join and
            // we don't need to return a GroupMemberInvitation as one is not
            // required
            return {group, membership: 'member'};
        }

        // we're a private group at this point and we must have been invited to it
        // to join it...
        const groupMemberInvitation = await GroupMemberInvitations.get(user.email!, groupID);

        if (groupMemberInvitation) {
            return {group, groupMemberInvitation};
        }

        throw new Error("We were not invited to this group");

    }

}

export interface GroupMemberInvitationInit {

    readonly groupID: GroupIDStr;

    /**
     * The address of the owner of this profile.  This is basically the
     * primary invite mechanism so that we can always invite by address.
     */
    readonly to: EmailStr;

    readonly message: string;

    /**
     * We have to keep the sender so that when we go to accept the doc we
     * actually know who it's from.
     */
    readonly from: Sender;

    /**
     * The actual DocID we're working with.
     */
    // TODO migrate to FirestoreTypedArray
    readonly docs: ReadonlyArray<DocRef>;

}

export interface GroupMemberInvitation extends GroupMemberInvitationInit {

    /**
     * The ID for this entry.
     */
    readonly id: string;

    readonly created: ISODateTimeString;
}

export interface Sender {

    readonly profileID: ProfileIDStr;

    readonly name: string;

    readonly email: string;

    readonly image: Image | null;

}

export class Senders {

    public static create(user: UserRecord, profileID: ProfileIDStr): Sender {

        const image = user!.photoURL ? {url: user!.photoURL, size: null} : null;

        return {
            profileID,
            name: user!.displayName || "",
            email: user!.email!,
            image
        };

    }
}

export type GroupMemberInvitationIDStr = string;

interface GroupMemberVerification {

    readonly group: Group;

    readonly groupMemberInvitation?: GroupMemberInvitation;

    /**
     * True if we're already a member of this group.
     */
    readonly membership?: 'member' | 'invited';

}
