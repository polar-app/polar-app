import {MachineDatastore} from "./MachineDatastores";
import {useFirestore} from "../../../apps/repository/js/FirestoreProvider";
import {MachineIDs} from "polar-shared/src/util/MachineIDs";
import {OnErrorCallback} from "polar-shared/src/util/Snapshots";
import {ErrorType, useSnapshots} from "../ui/data_loader/UseSnapshotSubscriber";
import {IDocumentSnapshotClient} from "polar-firestore-like/src/IDocumentSnapshot";

export namespace MachineDatastoreHooks {

    const COLLECTION_NAME = "machine_datastore";

    function useCollectionRef() {

        const {firestore} = useFirestore();

        const id = MachineIDs.get();

        return firestore
            .collection(COLLECTION_NAME)
            .doc(id);

    }

    function toDoc(snapshot: IDocumentSnapshotClient) {

        if (! snapshot.exists) {
            return;
        }

        return snapshot.data() as MachineDatastore;

    }

    /**
     * Callback for when we have new data for the account.
     */
    function useMachineDatastore() {

        const ref = useCollectionRef();

        return (onNext: (machineDatastore: MachineDatastore) => void,
                onError: OnErrorCallback = ERR_HANDLER) => {

            return ref.onSnapshot((snapshot: IDocumentSnapshotClient) => {

                const doc = toDoc(snapshot);

                if (! doc) {
                    return;
                }

                onNext(doc);

            }, onError);

        }

    }

    export function useMachineDatastoreSnapshots() {
        const snapshotProvider = useMachineDatastore();
        return useSnapshots(snapshotProvider);
    }

    const ERR_HANDLER = (err: ErrorType) => console.error("Error during snapshot: ", err);

}
