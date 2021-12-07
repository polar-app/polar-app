import * as React from "react";
import {usePrefsContext} from "../../../apps/repository/js/persistence_layer/PrefsContext2";

/**
 * Return true/false based on a feature toggle name.
 */
export function usePrefsFeatureToggle(featureName: string): boolean {
    const prefs = usePrefsContext();
    return prefs.isMarked(featureName);
}

/**
 * Return a feature toggler function so that we can change the value of a feature toggle.
 */
export function usePrefsFeatureToggler() {

    const prefs = usePrefsContext();

    return React.useCallback(async (featureName, state: boolean = true) => {
        prefs.mark(featureName, state);
        await prefs.commit();
    }, [prefs]);

}
