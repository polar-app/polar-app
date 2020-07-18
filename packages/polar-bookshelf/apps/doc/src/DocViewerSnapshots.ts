import {UUIDs} from "../../../web/js/metadata/UUIDs";

export namespace DocViewerSnapshots {

    export function isStaleUpdate(current: string | undefined, updated: string | undefined) {

        if (! current) {
            return false;
        }

        return UUIDs.compare(current, updated) > 0;
    }

}
