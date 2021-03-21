/**
 * A simple reference to a user without using the uid.  This can be the email
 * (which we then resolve to a user and profile. Or a profile which we then
 * resolve to a user + profile.
 */
import {EmailStr} from "polar-shared/src/util/Strings";
import {ProfileIDStr} from "polar-firebase/src/firebase/om/Profiles";

export class UserRefs {

    public static fromEmail(email: EmailStr): UserRef {
        return {value: email, type: 'email'};
    }

    public static fromProfileID(profileID: ProfileIDStr): UserRef {
        return {value: profileID, type: 'profileID'};
    }

}

export interface UserRef {
    readonly value: EmailStr | ProfileIDStr;
    readonly type: 'email' | 'profileID';
}
