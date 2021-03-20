import { PrefsWriter } from "./SettingToggle";

export function useLocalStoragePrefs(): PrefsWriter {

    function isMarked(key: string, defaultValue?: boolean): boolean {

        const value = localStorage.getItem(key);

        if (value) {
            return value === 'true';
        }

        return defaultValue || false;

    }

    function mark(key: string, value: boolean) {
        localStorage.setItem(key, `${value}`);
    }

    async function commit() {
        // noop
    }

    return {isMarked, mark, commit};

}