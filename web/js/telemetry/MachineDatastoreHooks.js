"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineDatastoreHooks = void 0;
const FirestoreProvider_1 = require("../../../apps/repository/js/FirestoreProvider");
const MachineIDs_1 = require("polar-shared/src/util/MachineIDs");
const UseSnapshotSubscriber_1 = require("../ui/data_loader/UseSnapshotSubscriber");
var MachineDatastoreHooks;
(function (MachineDatastoreHooks) {
    const COLLECTION_NAME = "machine_datastore";
    function useCollectionRef() {
        const { firestore } = FirestoreProvider_1.useFirestore();
        const id = MachineIDs_1.MachineIDs.get();
        return firestore
            .collection(COLLECTION_NAME)
            .doc(id);
    }
    function toDoc(snapshot) {
        if (!snapshot.exists) {
            return;
        }
        return snapshot.data();
    }
    function useMachineDatastore() {
        const ref = useCollectionRef();
        return (onNext, onError = ERR_HANDLER) => {
            return ref.onSnapshot((snapshot) => {
                const doc = toDoc(snapshot);
                if (!doc) {
                    return;
                }
                onNext(doc);
            }, onError);
        };
    }
    function useMachineDatastoreSnapshots() {
        const snapshotProvider = useMachineDatastore();
        return UseSnapshotSubscriber_1.useSnapshots(snapshotProvider);
    }
    MachineDatastoreHooks.useMachineDatastoreSnapshots = useMachineDatastoreSnapshots;
    const ERR_HANDLER = (err) => console.error("Error during snapshot: ", err);
})(MachineDatastoreHooks = exports.MachineDatastoreHooks || (exports.MachineDatastoreHooks = {}));
//# sourceMappingURL=MachineDatastoreHooks.js.map