import {createFirestoreSnapshotForUserCollection} from "../stores/FirestoreSnapshotStore";
import {UserReferralCollection} from "polar-firebase/src/firebase/om/UserReferralCollection";
import IUserReferral = UserReferralCollection.IUserReferral;

export const [UserReferralCollectionSnapshots, useUserReferralCollectionSnapshot]
    = createFirestoreSnapshotForUserCollection<IUserReferral>(UserReferralCollection.COLLECTION_NAME, {initialEmpty: true});

