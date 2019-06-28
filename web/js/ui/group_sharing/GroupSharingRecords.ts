import {GroupMember} from '../../datastore/sharing/db/GroupMembers';
import {GroupMembers} from '../../datastore/sharing/db/GroupMembers';
import {GroupMemberInvitation} from '../../datastore/sharing/db/GroupMemberInvitations';
import {GroupMemberInvitations} from '../../datastore/sharing/db/GroupMemberInvitations';
import {ISODateTimeString} from '../../metadata/ISODateTimeStrings';
import {Image} from '../../datastore/sharing/db/Images';
import {Groups} from '../../datastore/sharing/db/Groups';
import {Profiles} from '../../datastore/sharing/db/Profiles';
import {Optional} from '../../util/ts/Optional';
import {Promises} from '../../util/Promises';
import {Contacts} from '../../datastore/sharing/db/Contacts';
import {Contact} from '../../datastore/sharing/db/Contacts';

export class GroupSharingRecords {

    public static fetch(groupID: string,
                        contactsHandler: (contacts: ReadonlyArray<Contact>) => void,
                        membersHandler: (members: ReadonlyArray<MemberRecord>) => void,
                        errorHandler: (err: Error) => void) {

        let members: MemberRecord[] = [];

        const getGroupMemberInvitations = async (): Promise<ReadonlyArray<MemberRecord>> => {

            const profile = await Profiles.currentUserProfile();

            if (! profile) {
                throw new Error("No profile");
            }

            console.log("FIXME333...");

            console.log(`FIXME333: resolving for groupID: ${groupID} and profileID: ${profile.id}`)

            const records
                = await GroupMemberInvitations.listByGroupIDAndProfileID(groupID, profile.id);

            console.log("FIXME333...done");

            const memberRecordInits: MemberRecord[] = records.map(current => {

                return {
                    profileID: current.from.profileID,
                    label: current.to,
                    created: current.created,
                    type: 'group-member-invitation',
                    value: current
                };

            });

            const resolvedProfiles = await Profiles.resolve(memberRecordInits);

            return resolvedProfiles.map(current => {
                const [memberRecordInit , profile] = current;

                if (profile) {

                    return {
                        ...memberRecordInit,
                        label: profile.name || memberRecordInit.label,
                        image: Optional.of(profile.image).getOrUndefined()
                    };

                } else {
                    return memberRecordInit;
                }

            });

        };

        const getGroupMembers = async (): Promise<ReadonlyArray<MemberRecord>> => {

            console.log("FIXME222...");

            const records = await GroupMembers.list(groupID);

            console.log("FIXME222...done");

            const memberRecordInits: MemberRecord[] = records.map(current => {

                return {
                    profileID: current.profileID,
                    // this is ugly but we're going to replace it below.
                    label: current.profileID,
                    created: current.created,
                    type: 'group-member-invitation',
                    value: current
                };

            });

            const resolvedProfiles = await Profiles.resolve(memberRecordInits);

            return resolvedProfiles.map(current => {
                const [memberRecordInit , profile] = current;

                if (profile) {

                    return {
                        ...memberRecordInit,
                        label: profile.name || "unnamed",
                        image: Optional.of(profile.image).getOrUndefined()
                    };

                } else {
                    return memberRecordInit;
                }

            });

        };

        const fireMembersHandler = (newMembers: ReadonlyArray<MemberRecord>) => {

            members = [...members, ...newMembers].sort((a, b) => a.label.localeCompare(b.label));
            membersHandler(members);

        };

        const doHandleMembership = async () => {
            const group = await Groups.get(groupID);

            if (group) {

                const promises = [
                    getGroupMembers(),
                    getGroupMemberInvitations()
                ].map(current => {

                    // now for each one we have to call the handler to merge
                    // and fire the member records.

                    const handler = async () => {
                        fireMembersHandler(await current);
                    };

                    return handler();

                });

                Promises.executeInBackground(promises, err => errorHandler(err));

            }

        };

        const doHandleContacts = async () => {
            const contacts = await Contacts.list();
            contactsHandler(contacts);
        };

        Promises.executeInBackground([
           doHandleContacts(),
           doHandleMembership()
       ], err => errorHandler(err));

    }

}

export interface MemberRecord {

    readonly profileID: string;
    readonly label: string;
    readonly type: 'group-member' | 'group-member-invitation';
    readonly value: GroupMember | GroupMemberInvitation;
    readonly created: ISODateTimeString;
    readonly image?: Image;

}
