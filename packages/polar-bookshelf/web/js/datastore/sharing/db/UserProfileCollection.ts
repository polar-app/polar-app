import {ProfileCollection} from "./ProfileCollection";
import {CacheFirstThenServerGetOptions, GetOptions} from "../../../firebase/firestore/DocumentReferences";
import {isPresent} from 'polar-shared/src/Preconditions';
import {IProfile, ProfileIDStr} from "polar-firebase/src/firebase/om/ProfileCollection";

export class UserProfileCollection {

    public static async get(profileID: ProfileIDStr,
                            opts: GetOptions = new CacheFirstThenServerGetOptions()): Promise<IUserProfile | undefined> {

        const currentUserProfile = await ProfileCollection.currentProfile(opts);
        const profile = await ProfileCollection.get(profileID, opts);

        if (! profile) {
            return undefined;
        }

        const self = isPresent(currentUserProfile) &&
                     currentUserProfile!.id === profile.id;

        return {self, profile};

    }

    public static async currentUserProfile(opts: GetOptions = new CacheFirstThenServerGetOptions()): Promise<IUserProfile | undefined> {
        const profile = await ProfileCollection.currentProfile(opts);

        if (! profile) {
            return undefined;
        }

        return {self: true, profile};
    }

}


export interface IUserProfile {

    readonly profile: IProfile;

    /**
     * True if this profile represents myself.
     */
    readonly self: boolean;

}
