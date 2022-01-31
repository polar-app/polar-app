import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";
import {ISnapshot} from "./SnapshotStore";
import {IDStr} from "polar-shared/src/util/Strings";

/**
 * Compute the snapshot consistency by listening to server-snapshots and looking
 * at docChanges.
 */
export namespace SnapshotCacheConsistencyManager {

    // This system is partially incorrect.
    //
    // https://www.reddit.com/r/Firebase/comments/sge5co/is_there_a_way_to_compute_when_the_firestore/?

    // additionally, there's another bug whereby if we have a dirty-cache on
    // startup, we have NO way to determine that the cache is actually dirty
    // until we get the first server-snapshot.
    //
    // I could probably solve this by having another state like 'stale' where
    // we're unknown until we get the first server-side snapshot.

    /**
     * The consistency of snapshots:
     *
     * stale: We have not yet received a server-snapshot, so we don't know
     * anything about the current cache status.
     *
     * dirty: We've written to the local cache, and not yet received an update
     * from the server.
     *
     * clean: We've received a server snapshot and the dirty documents have been
     * reset and there are no more dirty documents and everything is consistent
     * with the server.
     *
     */
    export type Consistency = 'stale' | 'dirty' | 'clean';

    export interface ISnapshotCacheConsistencyManager {
        readonly update: (snapshot: ISnapshot<IQuerySnapshot<ISnapshotMetadata>>) => Consistency;
    }

    export function create(): ISnapshotCacheConsistencyManager {

        let consistency: Consistency = 'stale';

        interface IDirtyDocs {
            [id: IDStr]: boolean;
        }

        const dirtyDocs: IDirtyDocs = {};

        let hasServerSnapshot: boolean = false;

        function update(snapshot: ISnapshot<IQuerySnapshot<ISnapshotMetadata>>): Consistency {

            if (snapshot.right !== undefined) {

                function handleCacheSnapshot() {

                    for (const docChange of snapshot.right!.docChanges()) {

                        if (docChange.doc.metadata.hasPendingWrites) {
                            dirtyDocs[docChange.id] = true;
                        }

                    }

                }

                function handleServerSnapshot() {

                    for (const docChange of snapshot.right!.docChanges()) {

                        if (! docChange.doc.metadata.hasPendingWrites) {
                            delete dirtyDocs[docChange.id];
                        }

                    }

                }

                if (snapshot.right.metadata.fromCache) {
                    handleCacheSnapshot();
                } else {
                    handleServerSnapshot();
                    hasServerSnapshot = true;
                }

                function computeConsistency() {

                    if (hasServerSnapshot) {
                        return Object.keys(dirtyDocs).length === 0 ? 'clean' : 'dirty';
                    }

                    return 'stale';

                }

                // if there are no objects in the dirty buffer we're clean. one
                // main problem here is that if we get a server-snapshot from
                // another writer BEFORE we upload the local cache we're going
                // to get an incorrect status.
                consistency = computeConsistency();

            } else {
                // we have an exception, so we're dirty...
                consistency = "dirty";
            }

            return consistency;

        }

        return {update};

    }

}
