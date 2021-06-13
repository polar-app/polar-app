export namespace LocalStorageFeatureToggles {

    function hasLocalStorage() {
        return typeof localStorage !== 'undefined';
    }

    export function isEnabled(key: string): boolean {
        return hasLocalStorage() ? localStorage.getItem('notes.undo.trace') === 'true' : false;
    }

}
