"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCachedFirestoreSnapshotSubscriber = void 0;
const CachedSnapshotSubscriber_1 = require("./CachedSnapshotSubscriber");
function createCachedFirestoreSnapshotSubscriber(opts) {
    const cacheKey = CachedSnapshotSubscriber_1.LocalCache.createKey(opts.id);
    const initialValue = CachedSnapshotSubscriber_1.LocalCache.read(cacheKey);
    if (initialValue) {
        opts.onNext(initialValue);
    }
    const onNext = (firestoreSnapshot) => {
        function toSnapshot() {
            if (firestoreSnapshot === undefined) {
                return undefined;
            }
            else {
                return {
                    exists: firestoreSnapshot.exists,
                    value: firestoreSnapshot.data(),
                    source: firestoreSnapshot.metadata.fromCache ? 'cache' : 'server'
                };
            }
        }
        const snapshot = toSnapshot();
        opts.onNext(snapshot);
        CachedSnapshotSubscriber_1.LocalCache.write(cacheKey, snapshot);
    };
    return opts.ref.onSnapshot(onNext, opts.onError);
}
exports.createCachedFirestoreSnapshotSubscriber = createCachedFirestoreSnapshotSubscriber;
//# sourceMappingURL=CachedFirestoreSnapshotSubscriber.js.map