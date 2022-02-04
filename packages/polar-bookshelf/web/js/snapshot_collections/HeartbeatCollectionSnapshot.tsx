import {HeartbeatCollection, IHeartbeat} from "polar-firebase/src/firebase/om/HeartbeatCollection";
import {createFirestoreSnapshotForUserCollection} from "../stores/FirestoreSnapshotStore";
import {DeviceIDManager} from "polar-shared/src/util/DeviceIDManager";
import {Arrays} from "polar-shared/src/util/Arrays";
import {IEither} from "../util/Either";

export const [HeartbeatCollectionSnapshotProvider, useHeartbeatCollectionSnapshot, HeartbeatCollectionSnapshotLoader, HeartbeatCollectionSnapshotLatch]
    = createFirestoreSnapshotForUserCollection<IHeartbeat>(HeartbeatCollection.COLLECTION_NAME, {initialEmpty: true});


export function useHeartbeatCollectionSnapshotForDeviceID(): IEither<IHeartbeat | undefined> {

    const deviceID = DeviceIDManager.DEVICE_ID;

    const snapshot = useHeartbeatCollectionSnapshot();

    if (snapshot.right) {

        const heartbeat = Arrays.first(snapshot.right.docs.filter(current => current.data().device_id === deviceID)
                                                          .map(current => current.data()));

        return {right: heartbeat};

    }

    return {left: snapshot.left};

}
