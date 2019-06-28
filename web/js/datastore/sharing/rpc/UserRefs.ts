/**
 * A simple reference to a user without using the uid.  This can be the email
 * (which we then resolve to a user and profile. Or a profile which we then
 * resolve to a user + profile.
 */
import {ProfileIDStr} from '../db/Profiles';
import {EmailStr} from '../../../util/Strings';

export interface UserRef {
    readonly value: EmailStr | ProfileIDStr;
    readonly type: 'email' | 'profileID';
}
