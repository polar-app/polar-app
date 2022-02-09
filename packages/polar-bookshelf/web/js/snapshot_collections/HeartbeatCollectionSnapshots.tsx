import {HeartbeatCollection, IHeartbeat} from "polar-firebase/src/firebase/om/HeartbeatCollection";
import {createFirestoreSnapshotForUserCollection} from "../stores/FirestoreSnapshotStore";
import {DeviceIDManager} from "polar-shared/src/util/DeviceIDManager";
import {Arrays} from "polar-shared/src/util/Arrays";
import {IEither} from "../util/Either";
import {TimeDurations} from "polar-shared/src/util/TimeDurations";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Simulate} from "react-dom/test-utils";


export const [HeartbeatCollectionSnapshots, useHeartbeatCollectionSnapshot]
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

/**
 * Figure out the active devices based on heartbeats.
 */
export function useActiveHeartbeats(): ReadonlyArray<IHeartbeat> {

    const snapshot = useHeartbeatCollectionSnapshot();

    if (snapshot.right) {

        const heartbeats = snapshot.right.docs.map(current => current.data());

        const cutoff = (Date.now() - TimeDurations.toMillis('2w'));

        return heartbeats.filter(current => ISODateTimeStrings.parse(current.updated).getTime() > cutoff);

    }

    throw snapshot.left;

}
