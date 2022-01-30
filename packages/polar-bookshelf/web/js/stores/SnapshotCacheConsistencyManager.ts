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

                function handleCacheSnapshot() {

                    for (const docChange of snapshot.right!.docChanges()) {
                        dirtyDocs[docChange.id] = true;
                    }

                }

                function handleServerSnapshot() {

                    for (const docChange of snapshot.right!.docChanges()) {
                        delete dirtyDocs[docChange.id];
                    }

                }

                if (snapshot.right.metadata.fromCache) {
                    handleCacheSnapshot();
                } else {
                    handleServerSnapshot();
                }

                // if there are no objects in the dirty buffer we're clean. one
                // main problem here is that if we get a server-snapshot from
                // another writer BEFORE we upload the local cache we're going
                // to get an incorrect status.
                consistency = Object.keys(dirtyDocs).length === 0 ? 'clean' : 'dirty';

            } else {
                // we have an exception, so we're dirty...
                consistency = "dirty";
            }

            return consistency;

        }

        return {update};

    }

}
