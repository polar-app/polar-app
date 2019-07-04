import {Profile, ProfileIDStr, Profiles} from "./Profiles";
import {CacheFirstThenServerGetOptions, GetOptions} from "../../../firebase/firestore/DocumentReferences";

export class UserProfiles {

    public static async get(profileID: ProfileIDStr,
                            opts: GetOptions = new CacheFirstThenServerGetOptions()): Promise<UserProfile> {

        const currentUserProfile = await Profiles.currentUserProfile(opts);
        const profile = await Profiles.get(profileID, opts);

        if (! profile) {
            throw new Error("No profile for ID: " + profileID);
        }

        const self = currentUserProfile.id === profile.id;

        return {self, profile};

    }

    public static async currentUserProfile(opts: GetOptions = new CacheFirstThenServerGetOptions()): Promise<UserProfile> {
        const profile = await Profiles.currentUserProfile(opts);
        return {self: true, profile};
    }

}


export interface UserProfile {

    readonly profile: Profile;

    /**
     * True if this profile represents myself.
     */
    readonly self: boolean;

}
