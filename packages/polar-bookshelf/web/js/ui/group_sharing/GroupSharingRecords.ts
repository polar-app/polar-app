import {GroupMember} from 'polar-firebase/src/firebase/om/GroupMemberCollection';
import {GroupMemberInvitation} from '../../datastore/sharing/db/GroupMemberInvitations';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Image} from '../../datastore/sharing/db/Images';
import {Group} from '../../datastore/sharing/db/Groups';
import {Contact} from 'polar-firebase/src/firebase/om/ContactCollection';
import {Logger} from "polar-shared/src/logger/Logger";
import {IProfile} from "polar-firebase/src/firebase/om/ProfileCollection";
import {IFirestore} from "polar-firestore-like/src/IFirestore";

const log = Logger.create();

export class GroupSharingRecords {

    public static fetch(firestore: IFirestore<unknown>,
                        groupID: string,
                        contactsHandler: (contacts: ReadonlyArray<ContactProfile>) => void,
                        membersHandler: (members: ReadonlyArray<MemberRecord>) => void,
                        groupsHandler: (groups: ReadonlyArray<Group>) => void,
                        errorHandler: (err: Error) => void) {
        //
        // let members: MemberRecord[] = [];
        //
        // // TODO: these have to be snapshots because I'm going to be deleting
        // // from the members and the UI needs to update...
        //
        // const getGroupMemberInvitations = async (): Promise<ReadonlyArray<MemberRecord>> => {
        //
        //     const profile = await ProfileCollection.currentProfile(firestore);
        //
        //     if (! profile) {
        //         console.warn("No current user profile");
        //         return [];
        //     }
        //
        //     const records
        //         = await GroupMemberInvitations.listByGroupIDAndProfileID(groupID, profile.id);
        //
        //     return records.map(current => {
        //
        //         return {
        //             id: current.id,
        //             label: current.to,
        //             created: current.created,
        //             type: 'pending',
        //             value: current
        //         };
        //
        //     });
        //
        // };
        //
        // const getGroupMembers = async (): Promise<ReadonlyArray<MemberRecord>> => {
        //
        //     const records = await GroupMemberCollection.list(groupID);
        //     const firestore = await FirestoreBrowserClient.getInstance();
        //
        //     const memberRecordInits: MemberRecordWithProfile[] = records.map(current => {
        //
        //         return {
        //             id: current.id,
        //             profileID: current.profileID,
        //             // this is ugly but we're going to replace it below.
        //             label: current.profileID,
        //             created: current.created,
        //             type: 'member',
        //             value: current
        //         };
        //
        //     });
        //
        //     const resolvedProfiles = await ProfileCollection.resolve(firestore, memberRecordInits);
        //
        //     return resolvedProfiles.map(current => {
        //         const [memberRecordInit , profile] = current;
        //
        //         if (profile) {
        //
        //             return {
        //                 ...memberRecordInit,
        //                 label: profile.name || profile.handle || "unnamed",
        //                 image: Optional.of(profile.image).getOrUndefined()
        //             };
        //
        //         } else {
        //             return memberRecordInit;
        //         }
        //
        //     });
        //
        // };
        //
        // const fireMembersHandler = (newMembers: ReadonlyArray<MemberRecord>) => {
        //
        //     members = [...members, ...newMembers].sort((a, b) => a.label.localeCompare(b.label));
        //     membersHandler(members);
        //
        // };
        //
        // const doHandleMembership = async () => {
        //
        //     if (! await UserGroupCollection.hasPermissionForGroup(groupID)) {
        //         return;
        //     }
        //
        //     const group = await Groups.get(groupID);
        //
        //     if (group) {
        //
        //         const promises = [
        //             getGroupMembers(),
        //             getGroupMemberInvitations()
        //         ].map(current => {
        //
        //             // now for each one we have to call the handler to merge
        //             // and fire the member records.
        //
        //             const handler = async () => {
        //                 fireMembersHandler(await current);
        //             };
        //
        //             return handler();
        //
        //         });
        //
        //         Promises.executeInBackground(promises, err => errorHandler(err));
        //
        //     }
        //
        // };
        //
        // const doHandleContacts = async () => {
        //     const contacts = await ContactCollection.list();
        //     const firestore = await FirestoreBrowserClient.getInstance();
        //
        //     const resolvedProfiles = await ProfileCollection.resolve(firestore, contacts);
        //
        //     const contactProfiles = resolvedProfiles.map(current => {
        //
        //         const [contact, profile] = current;
        //
        //         return {contact, profile};
        //
        //     });
        //
        //     contactsHandler(contactProfiles);
        //
        // };
        //
        // const doHandleGroups = async () => {
        //     const groups = await UserGroupMembership.get();
        //     groupsHandler(groups);
        // };
        //
        // const doHandle = async () => {
        //
        //     await Promise.all([
        //         doHandleContacts(),
        //         doHandleMembership(),
        //         doHandleGroups()
        //     ]);
        //
        // };
        //
        // doHandle()
        //     .catch(err => errorHandler(err));

    }

}

export interface MemberRecord {

    readonly id: string;
    readonly label: string;
    readonly type: 'member' | 'pending';
    readonly value: GroupMember | GroupMemberInvitation;
    readonly created: ISODateTimeString;
    readonly image?: Image;

}

export interface MemberRecordWithProfile extends MemberRecord {

    readonly profileID: string;

}

export interface ContactProfile {
    readonly contact: Contact;
    readonly profile?: IProfile;
}
