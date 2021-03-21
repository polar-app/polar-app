import {EmailStr} from './Profiles';
import {ProfileIDStr} from './Profiles';
import {UserRecord} from 'firebase-functions/lib/providers/auth';
import {Profile} from './Profiles';
import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import {ProfileOwners} from './ProfileOwners';
import {Profiles} from './Profiles';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {AsyncProviders} from 'polar-shared/src/util/Providers';
import {ProfileOwner} from './ProfileOwners';
import {UserRefInvitations} from '../GroupInvites';
import {Invitations} from '../GroupInvites';

/**
 * Takes a reference to a user (either a profileID or an email address)
 * and returns a reference to that user with both the profile and user account.
 */
export class UserProfiles {

    public static async fromUserRef(userRef: UserRef): Promise<UserProfile> {

        switch (userRef.type) {

            case 'email':
                return this.fromEmail(userRef.value);

            case 'profileID':
                return this.fromProfileID(userRef.value);

        }

    }

    public static async fromUser(user: UserRecord): Promise<UserProfile> {

        const app = FirebaseAdmin.app();
        const auth = app.auth();

        const getUser = async () => {
            return user;
        };

        const getUserID = async () => {
            return user.uid;
        };

        const getEmail = async () => {
            return user.email!;
        };

        const getProfileOwner = AsyncProviders.memoize(async () => {
            return await ProfileOwners.get(user.uid);
        });

        const getProfile = AsyncProviders.memoize(async () => {
            const profileOwner = await getProfileOwner();

            if (! profileOwner) {
                return undefined;
            }

            return await Profiles.get(profileOwner.profileID);

        });

        const getProfileID = async () => {
            const profile = await getProfile();

            if (profile) {
                return profile.id;
            }

            return undefined;

        };

        return {getUser, getUserID, getEmail, getProfileOwner, getProfile, getProfileID};

    }

    public static async fromEmail(email: EmailStr): Promise<UserProfile> {

        const app = FirebaseAdmin.app();
        const auth = app.auth();

        const getUser = AsyncProviders.memoize(async () => {

            try {
                return await auth.getUserByEmail(email);
            } catch (e) {
                console.warn("Unable to find user: ", e);
                return undefined;
            }

        });

        const getUserID = async () => {

            const user = await getUser();

            if (user) {
                return user.uid;
            }

            return undefined;

        };

        const getEmail = async () => {
            return email;
        };

        const getProfileOwner = AsyncProviders.memoize(async () => {
            return await ProfileOwners.getByEmail(email);
        });

        const getProfile = AsyncProviders.memoize(async () => {
            const profileOwner = await getProfileOwner();

            if (! profileOwner) {
                return undefined;
            }

            return await Profiles.get(profileOwner.profileID);

        });

        const getProfileID = async () => {
            const profile = await getProfile();

            if (profile) {
                return profile.id;
            }

            return undefined;

        };

        return {getUser, getUserID, getEmail, getProfileOwner, getProfile, getProfileID};

    }

    public static async fromProfileID(profileID: ProfileIDStr): Promise<UserProfile> {

        const app = FirebaseAdmin.app();
        const auth = app.auth();

        const getUser = AsyncProviders.memoize(async () => {
            const profileOwner = await getProfileOwner();
            return await auth.getUser(profileOwner!.uid);
        });

        const getUserID = async () => {
            const profileOwner = await getProfileOwner();
            return profileOwner.uid;
        };

        const getEmail = async () => {
            const profileOwner = await getProfileOwner();
            return profileOwner.email;
        };

        const getProfileOwner = AsyncProviders.memoize(async () => {
            const profileOwner = await ProfileOwners.getByProfileID(profileID);
            Preconditions.assertPresent(profileOwner, 'profileOwner');
            return profileOwner!;
        });

        const getProfile = AsyncProviders.memoize(async () => {
            const profile = await Profiles.get(profileID);
            Preconditions.assertPresent(profile, 'profile');
            return profile!;
        });

        const getProfileID = async () => {
            return profileID;
        };

        return {getUser, getUserID, getEmail, getProfileOwner, getProfile, getProfileID};

    }

}

/**
 * A user profile which may have a user
 */
export interface UserProfile {

    /**
     * Get the users UserRecord.
     */
    getUser(): Promise<UserRecord | undefined>;

    getUserID(): Promise<ProfileIDStr | undefined>;

    getEmail(): Promise<EmailStr>;

    /**
     * Get the users profile.
     */
    getProfileOwner(): Promise<ProfileOwner | undefined>;

    /**
     * Get the users profile.
     */
    getProfile(): Promise<Profile | undefined>;

    getProfileID(): Promise<ProfileIDStr| undefined>;

}

export class UserRefs {

    public static async toInvitations(userRefInvitations: UserRefInvitations) {

        const invitations: Invitations = {
            message: userRefInvitations.message,
            to: await UserRefs.toEmailAddrs(userRefInvitations.to)
        };

        return invitations;

    }

    /**
     * Lookup the profileIDs here if we are subscribing via profileIDs.
     * @param userRefs
     */
    public static toEmailAddrs(userRefs: ReadonlyArray<UserRef>): Promise<ReadonlyArray<EmailStr>> {

        const promises = userRefs.map(current => {

            switch (current.type) {

                case 'email':
                    return Promise.resolve(current.value);

                case 'profileID':

                    const handler = async (): Promise<EmailStr> => {
                        const profileOwner = await ProfileOwners.getByProfileID(current.value);

                        if (! profileOwner) {
                            throw new Error("No profile owner for: " + current.value);
                        }

                        if (! profileOwner.email) {
                            throw new Error("Profile owner has no email: " + current.value);
                        }

                        return profileOwner!.email;

                    };

                    return handler();

            }

        });

        return Promise.all(promises);

    }

    public static fromEmail(email: EmailStr): UserRef {
        return {value: email, type: 'email'};
    }

    public static fromProfileID(profileID: ProfileIDStr): UserRef {
        return {value: profileID, type: 'profileID'};
    }

}

/**
 * A simple reference to a user without using the uid.  This can be the email
 * (which we then resolve to a user and profile. Or a profile which we then
 * resolve to a user + profile.
 */
export interface UserRef {
    readonly value: EmailStr | ProfileIDStr;
    readonly type: 'email' | 'profileID';
}

