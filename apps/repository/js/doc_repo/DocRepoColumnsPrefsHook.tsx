import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {usePrefsContext} from "../persistence_layer/PersistenceLayerApp";

const PREF_KEY = 'doc_repo_columns';

export function useDocRepoColumnsPrefs(): ReadonlyArray<keyof IDocInfo> {

    const prefs = usePrefsContext();

    const prefValue = prefs.get(PREF_KEY);

    if (prefValue) {

        try {
            return JSON.parse(prefValue);
        } catch (e) {
            console.error("Could not parse perf: ", e);
        }

    }

    return ['title', 'added', 'lastUpdated', 'tags', 'progress'];

}