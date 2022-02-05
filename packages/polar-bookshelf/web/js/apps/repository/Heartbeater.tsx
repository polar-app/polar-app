import {LinearProgress} from "@material-ui/core";
import * as React from "react";
import {
    HeartbeatCollectionSnapshotLatch,
    useHeartbeatCollectionSnapshotForDeviceID
} from "../../snapshot_collections/HeartbeatCollectionSnapshot";
import {HeartbeatCollection, IHeartbeat} from "polar-firebase/src/firebase/om/HeartbeatCollection";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {useDebouncer} from "../../notes/persistence/BlocksPersistenceWriters";
import {useHistory} from "react-router";

// TODO: this needs to be tested but we're going to have to figure out away to
// mock the 'firestore' interface.

function useHeartbeater() {

    const heartbeat = useHeartbeatCollectionSnapshotForDeviceID();

    const {uid, firestore} = useFirestore();
    const history = useHistory();

    const doHeartbeatCreate = React.useCallback(async () => {
        const heartbeat = HeartbeatCollection.create(uid!);
        await HeartbeatCollection.write(firestore, heartbeat);
    }, [uid, firestore]);

    const doHeartbeatUpdate = React.useCallback(async (heartbeat: IHeartbeat) => {
        const updated = ISODateTimeStrings.create();
        await HeartbeatCollection.write(firestore, {...heartbeat, updated});
    }, [firestore]);

    const doHeartbeat = React.useCallback(async () => {

        if (! heartbeat.left) {

            if (heartbeat.right === undefined) {
                await doHeartbeatCreate();
            } else {
                await doHeartbeatUpdate(heartbeat.right);
            }

        }

    }, [heartbeat, doHeartbeatUpdate, doHeartbeatCreate]);

    const doHeartbeatWithDebounce = useDebouncer(doHeartbeat, 5000);

    React.useEffect(() => {

        // now listen to the React history and make sure it's being debounced properly.

        return history.listen(() => {
            doHeartbeatWithDebounce()
        })

    }, [doHeartbeatWithDebounce]);

}

const Inner = () => {

    useHeartbeater();

    return null;
}

export const Heartbeater = () => {
    return (
        <HeartbeatCollectionSnapshotLatch fallback={<LinearProgress/>}>
            <Inner/>
        </HeartbeatCollectionSnapshotLatch>
    );
}
