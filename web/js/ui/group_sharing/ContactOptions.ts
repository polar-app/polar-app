import {ContactProfile} from './GroupSharingRecords';
import {UserRef} from '../../datastore/sharing/rpc/UserRefs';
import {ContactOption} from './ContactsSelector';

export class ContactOptions {

    public static toContactOptions(contactProfiles: ReadonlyArray<ContactProfile>): ReadonlyArray<ContactOption> {

        return  contactProfiles.map(current => {

            if (current.profile) {
                return {
                    value: current.profile.id,
                    label: current.profile.name || current.profile.handle || current.contact.email || ""
                };
            } else {
                return {
                    value: current.contact.email!,
                    label: current.contact.email!
                };
            }

        });

    }

    public static toUserRefs(options: ReadonlyArray<ContactOption> = []): ReadonlyArray<UserRef> {

        return options.map(current => {

            if (current.value.indexOf("@") !== -1) {

                return {
                    value: current.value,
                    type: 'email'
                };

            }

            return {
                value: current.value,
                type: 'profileID'
            };

        });

    }

}
