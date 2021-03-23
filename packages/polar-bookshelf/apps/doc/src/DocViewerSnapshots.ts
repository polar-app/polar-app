import {UUIDs} from "../../../web/js/metadata/UUIDs";

export namespace DocViewerSnapshots {

    export type UpdateType = 'fresh' | 'stale';
    export type ExtendedUpdateType = 'fresh' | 'stale' | 'self';

    export interface DocViewerSnapshotUpdate {
        readonly cmp: number | undefined;
        readonly type: ExtendedUpdateType;
    }

    export function isStaleUpdate(current: string | undefined, updated: string | undefined) {

        if (! current) {
            return false;
        }

        return UUIDs.compare(current, updated) >= 0;
    }

    export function computeUpdateType(current: string | undefined, updated: string | undefined): UpdateType {
        return DocViewerSnapshots.isStaleUpdate(current, updated) ? 'stale' : 'fresh';
    }

    export function computeUpdateType2(current: string | undefined, updated: string | undefined): ExtendedUpdateType {

        if (! current) {
            return 'fresh';
        }

        const cmp = UUIDs.compare(current, updated);

        if (cmp > 0) {
            return 'stale'
        }

        return 'self';

    }

    /**
     * New update calculator that uses the proper comparison cmp function and returns additional metadata
     * for analyzing the update.
     */
    export function computeUpdateType3(current: string | undefined, updated: string | undefined): DocViewerSnapshotUpdate {

        if (! current) {
            return {
                cmp: undefined,
                type: 'fresh'
            };
        }

        const cmp = UUIDs.compare2(current, updated);

        if (cmp < 0) {
            return {
                cmp,
                type: 'stale'
            }
        }

        if (cmp > 0) {
            return {
                cmp,
                type: 'fresh'
            }
        }

        return {
            cmp,
            type: 'self'
        };

    }


}
