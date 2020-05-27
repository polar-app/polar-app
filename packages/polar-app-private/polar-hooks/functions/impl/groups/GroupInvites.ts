import {GroupMemberInvitations} from './db/GroupMemberInvitations';
import {Sender} from './db/GroupMemberInvitations';
import {Contacts} from './db/Contacts';
import {MutableContactInit} from './db/Contacts';
import {WriteBatch} from '@google-cloud/firestore';
import {GroupIDStr} from './db/Groups';
import {IDUser} from '../util/IDUsers';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {ProfileOwners} from './db/ProfileOwners';
import {UserGroups} from './db/UserGroups';
import {UserRef} from './db/UserRefs';
import {EmailStr} from './db/Profiles';
import {EmailAddress, Mandrill} from "../util/Mandrill";
import {GroupJoins} from "./GroupJoins";

export class GroupInvites {

    public static async invite(batch: WriteBatch,
                               idUser: IDUser,
                               groupID: GroupIDStr,
                               from: Sender,
                               invitations: Invitations,
                               docs: ReadonlyArray<DocRef> = []) {

        for (const to of invitations.to) {

            const groupMemberInvitation = await GroupMemberInvitations.getByGroupIDAndTo(groupID, to);

            if (! groupMemberInvitation) {

                // only invite if we haven't already been invited
                GroupMemberInvitations.create(batch, {
                    groupID,
                    from,
                    message: invitations.message,
                    to,
                    docs
                });

                UserGroups.addInvitation(batch, idUser, groupID);

            }

            const contactInit: MutableContactInit = {
                email: to,
                rel: ['shared'],
                reciprocal: false
            };

            const profileOwner = await ProfileOwners.getByEmail(to);

            if (groupMemberInvitation) {

                const url = GroupJoins.createShareURL(groupMemberInvitation);
                const title = docs[0].title;

                const createMessageFrom = (): EmailAddress => {

                    const result = {
                        email: "noreply@getpolarized.io",
                        name: ''
                    };

                    if (from.name) {
                        result.name = `Polar (${from.name})`;
                    } else if (from.email) {
                        result.name = `Polar (${from.email})`;
                    } else {
                        result.name = 'Polar';
                    }

                    return result;

                };

                await Mandrill.sendDocumentShared(createMessageFrom(), [{email: to}], title, from.name, url);

            }

            if (profileOwner) {

                // we have to make sure these records aren't already present and
                // shouldn't just create them directly...  what if they invite
                // by email BUT we have them as a profile UID.

                contactInit.profileID = profileOwner.profileID;
            }

            await Contacts.createOrUpdate(batch, idUser, contactInit);

        }

    }

}

export interface UserRefInvitations {

    readonly message: string;

    readonly to: ReadonlyArray<UserRef>;

}

export interface Invitations {

    readonly message: string;

    readonly to: ReadonlyArray<EmailStr>;

}
