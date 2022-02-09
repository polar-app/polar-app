import {createFirestoreSnapshotForUserCollection} from "../stores/FirestoreSnapshotStore";
import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import {Arrays} from "polar-shared/src/util/Arrays";
import {IEither} from "../util/Either";
import IUserReferral = UserReferralCollection.IUserReferral;

export const [UserReferralCollectionSnapshots, useUserReferralCollectionSnapshot]
    = createFirestoreSnapshotForUserCollection<IUserReferral>(UserReferralCollection.COLLECTION_NAME, {initialEmpty: true});


export function useUserReferral(): IEither<IUserReferral> {

    const snapshot = useUserReferralCollectionSnapshot();

    if (snapshot.left) {
        console.log("FIXME: left");
        return {left: snapshot.left};
    }

    const referral = Arrays.first(snapshot.right?.docs || [])?.data();
    console.log("FIXME: referral: ", referral);

    return {right: referral!};

}
