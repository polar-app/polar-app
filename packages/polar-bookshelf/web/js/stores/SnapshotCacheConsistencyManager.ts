import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";
import {ISnapshot} from "./SnapshotStore";
import {IDStr} from "polar-shared/src/util/Strings";

/**
 * Compute the snapshot consistency by listening to server-snapshots and looking
 * at docChanges.
 */
export namespace SnapshotCacheConsistencyManager {
    /**
     * The consistency of snapshots:
     *
     * dirty: We've written to the local cache, and not yet received an update
     * from the server.
     *
     * clean: We've received a server snapshot and the dirty documents have been
     * reset and there are no more dirty documents and everything is consistent
     * with the server.
     *
     */
    export type Consistency = 'dirty' | 'clean';

    export interface ISnapshotCacheConsistencyManager {
        readonly update: (snapshot: ISnapshot<IQuerySnapshot<ISnapshotMetadata>>) => Consistency;
    }

    export function create(): ISnapshotCacheConsistencyManager {

        let consistency: Consistency = 'dirty';

        interface IDirtyDocs {
            [id: IDStr]: boolean;
        }

        const dirtyDocs: IDirtyDocs = {};

        function update(snapshot: ISnapshot<IQuerySnapshot<ISnapshotMetadata>>): Consistency {

            if (snapshot.right !== undefined) {

                function handleSnapshot() {

                    for (const docChange of snapshot.right!.docChanges()) {

                        if (docChange.doc.metadata.hasPendingWrites) {
                            dirtyDocs[docChange.id] = true;
                        } else {
                            delete dirtyDocs[docChange.id];
                        }

                    }

                }

                handleSnapshot();

                function computeConsistency() {
                    return Object.keys(dirtyDocs).length === 0 ? 'clean' : 'dirty';
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
