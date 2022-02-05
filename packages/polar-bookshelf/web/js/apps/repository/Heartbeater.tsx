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
import {useRefValue} from "../../hooks/ReactHooks";
import {useErrorHandler} from "../../mui/MUIErrorHandler";

function useHeartbeater() {

    const heartbeat = useHeartbeatCollectionSnapshotForDeviceID();
    const errorHandler = useErrorHandler();

    const heartbeatRef = useRefValue(heartbeat);

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

    const doHeartbeat = React.useCallback(async () => {

        doHeartbeatAsync().catch(errorHandler);

    }, [doHeartbeatAsync]);

    const doHeartbeatWithDebounce = useDebouncer(doHeartbeat, 60000);

    React.useEffect(() => {

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
        <HeartbeatCollectionSnapshotLatch fallback={<LinearProgress/>}>
            <Inner/>
        </HeartbeatCollectionSnapshotLatch>
    );
}
