import * as React from 'react';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {useLogger} from "../../../../web/js/mui/MUILogger";
import { usePrefsContext } from '../persistence_layer/PrefsContext2';

const PREF_KEY = 'doc_repo_columns';

export function useDocRepoColumnsPrefs(): ReadonlyArray<keyof IDocInfo> {

    const prefs = usePrefsContext();

    const prefValue = prefs.fetch(PREF_KEY);

    if (prefValue) {

        try {
            return JSON.parse(prefValue.value);
        } catch (e) {
            console.error("Could not parse perf: ", e);
        }

    }

    return ['title', 'added', 'lastUpdated', 'tags', 'progress'];

}

export function useDocRepoColumnsPrefsMutator() {

    const prefs = usePrefsContext();
    const log = useLogger();

    return React.useCallback((columns: ReadonlyArray<keyof IDocInfo>) => {

        if (! prefs) {
            return;
        }

        prefs.set(PREF_KEY, JSON.stringify(columns));

        prefs.commit().catch(err => log.error(err));

    }, [log, prefs]);

}