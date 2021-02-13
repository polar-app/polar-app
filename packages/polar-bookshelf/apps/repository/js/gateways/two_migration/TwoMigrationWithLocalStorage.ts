import {LocalPrefs} from "../../../../../web/js/util/LocalPrefs";

export namespace TwoMigrationWithLocalStorage {

    const KEY = 'two-migration';

    /**
     * Return true if this should be shown under ideal circumstances
     */
    export function shouldShow(): boolean {
        return ! LocalPrefs.isMarked(KEY);
    }

    export function markShown() {
        LocalPrefs.mark(KEY);
    }

}
