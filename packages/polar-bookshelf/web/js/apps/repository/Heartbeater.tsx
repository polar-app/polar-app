import {LinearProgress} from "@material-ui/core";
import * as React from "react";
import {
    HeartbeatCollectionSnapshots,
    useActiveHeartbeats,
    useHeartbeatCollectionSnapshotForDeviceID
} from "../../snapshot_collections/HeartbeatCollectionSnapshots";
import {HeartbeatCollection, IHeartbeat} from "polar-firebase/src/firebase/om/HeartbeatCollection";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {useDebouncer} from "../../notes/persistence/BlocksPersistenceWriters";
import {useHistory} from "react-router";
import {useRefValue} from "../../hooks/ReactHooks";
import {useErrorHandler} from "../../mui/useErrorHandler";
import {useAnalytics} from "../../analytics/Analytics";

function useHeartbeater() {

    const heartbeat = useHeartbeatCollectionSnapshotForDeviceID();

    const activeHeartbeats = useActiveHeartbeats();
    const nrActiveDevices = React.useMemo(() => activeHeartbeats.length, [activeHeartbeats]);
    const nrActiveDevicesRef = useRefValue(nrActiveDevices);

    const errorHandler = useErrorHandler();

    const heartbeatRef = useRefValue(heartbeat);

    const {uid, firestore} = useFirestore();
    const history = useHistory();

    const analytics = useAnalytics();

    const doAnalytics = React.useCallback(() => {

        analytics.event2('heartbeat', {nr_active_devices: nrActiveDevicesRef.current});

    }, [analytics, nrActiveDevicesRef]);

    const doHeartbeatCreate = React.useCallback(async () => {
        const heartbeat = HeartbeatCollection.create(uid!);
        await HeartbeatCollection.write(firestore, heartbeat);

        doAnalytics();

    }, [uid, firestore, doAnalytics]);

    const doHeartbeatUpdate = React.useCallback(async (heartbeat: IHeartbeat) => {
        const updated = ISODateTimeStrings.create();
        await HeartbeatCollection.write(firestore, {...heartbeat, updated});

        doAnalytics();

    }, [firestore, doAnalytics]);

    const doHeartbeatAsync = React.useCallback(async () => {

        if (! heartbeatRef.current.left) {

            if (heartbeatRef.current.right === undefined) {
                await doHeartbeatCreate();
            } else {
                await doHeartbeatUpdate(heartbeatRef.current.right);
            }

        } else {
            console.error("heartbeat error: " , heartbeatRef.current.left);
        }

    }, [heartbeatRef, doHeartbeatUpdate, doHeartbeatCreate]);

    const doHeartbeat = React.useCallback(() => {

        doHeartbeatAsync().catch(errorHandler);

    }, [doHeartbeatAsync, errorHandler]);

    const doHeartbeatWithDebounce = useDebouncer(doHeartbeat, 60000);

    React.useEffect(() => {


        // first heartbeat on startup
        doHeartbeatWithDebounce();

        // now listen to the React history and make sure it's being debounced properly.

        return history.listen(() => {
            doHeartbeatWithDebounce();
        })

    }, [doHeartbeatWithDebounce, history]);

}

const Inner = () => {

    useHeartbeater();

    return null;
}

export const Heartbeater = () => {
    return (
        <HeartbeatCollectionSnapshots.Latch fallback={<LinearProgress/>}>
            <Inner/>
        </HeartbeatCollectionSnapshots.Latch>
    );
}
