import {UUIDs} from "../../../web/js/metadata/UUIDs";

export namespace DocViewerSnapshots {

    export type UpdateType = 'fresh' | 'stale';
    export type UpdateType2 = 'fresh' | 'stale' | 'self';

    export function isStaleUpdate(current: string | undefined, updated: string | undefined) {

        if (! current) {
            return false;
        }

        return UUIDs.compare(current, updated) >= 0;
    }

    export function computeUpdateType(current: string | undefined, updated: string | undefined): UpdateType {
        return DocViewerSnapshots.isStaleUpdate(current, updated) ? 'stale' : 'fresh';
    }

    export function computeUpdateType2(current: string | undefined, updated: string | undefined): UpdateType2 {

        if (! current) {
            return 'fresh';
        }

        const cmp = UUIDs.compare(current, updated);

        if (cmp > 0) {
            return 'stale'
        }

        return 'self';

    }


}
