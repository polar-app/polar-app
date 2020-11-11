"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSnapshots = void 0;
const CachedFirestoreSnapshotSubscriber_1 = require("../snapshots/CachedFirestoreSnapshotSubscriber");
const COLLECTION_NAME = "account";
var AccountSnapshots;
(function (AccountSnapshots) {
    function create(firestore, uid) {
        function createRef(uid) {
            return firestore
                .collection(COLLECTION_NAME)
                .doc(uid);
        }
        function onSnapshot(onNext, onError = ERR_HANDLER) {
            const ref = createRef(uid);
            return CachedFirestoreSnapshotSubscriber_1.createCachedFirestoreSnapshotSubscriber({
                id: 'accounts',
                ref,
                onNext,
                onError
            });
        }
        return onSnapshot;
    }
    AccountSnapshots.create = create;
})(AccountSnapshots = exports.AccountSnapshots || (exports.AccountSnapshots = {}));
const ERR_HANDLER = (err) => console.error("Could not create snapshot for account: ", err);
//# sourceMappingURL=AccountSnapshots.js.map