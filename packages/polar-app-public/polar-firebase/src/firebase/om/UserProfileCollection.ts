import {isPresent} from 'polar-shared/src/Preconditions';
import {ProfileIDStr} from "polar-shared/src/util/Strings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IProfile, ProfileCollection} from "./ProfileCollection";
import {CacheFirstThenServerGetOptions, IGetOptionsWithOrder} from "polar-firestore-like/src/DocumentReferences"
import {UserIDStr} from "polar-shared/src/util/Strings";

export class UserProfileCollection {

    public static async get(firestore: IFirestore<unknown>,
                            uid: UserIDStr,
                            profileID: ProfileIDStr,
                            opts: IGetOptionsWithOrder = new CacheFirstThenServerGetOptions()): Promise<IUserProfile | undefined> {

        const currentUserProfile = await ProfileCollection.currentProfile(firestore, uid, opts);
        const profile = await ProfileCollection.getWithOpts(firestore, profileID, opts);

        if (! profile) {
            return undefined;
        }

        const self = isPresent(currentUserProfile) &&
                     currentUserProfile!.id === profile.id;

        return {self, profile};

    }

    public static async currentUserProfile(firestore: IFirestore<unknown>,
                                           uid: UserIDStr,
                                           opts: IGetOptionsWithOrder = new CacheFirstThenServerGetOptions()): Promise<IUserProfile | undefined> {
        const profile = await ProfileCollection.currentProfile(firestore, uid, opts);

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
