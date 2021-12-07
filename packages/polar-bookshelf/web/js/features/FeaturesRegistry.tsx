import React from 'react';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {usePrefsContext} from "../../../apps/repository/js/persistence_layer/PrefsContext2";

export type FeatureName = 'design-m0' | 'notes-enabled' | 'note-stack' | 'answers';

interface IFeature {

    readonly feature: FeatureName;

    readonly description: string;

    /**
     * This feature is enabled by default for everyone.
     */
    readonly enabledByDefault?: true;

}

const REGISTRY: ReadonlyArray<IFeature> = [
    {
        feature: 'design-m0',
        description: "Design milestone 0",
    },
    {
        feature: 'notes-enabled',
        description: "Enable the new notes system",
    },
    {
        feature: 'note-stack',
        description: "Enable the new notes stack which allows the user to view pages visually as a horizontal stack.",
    },
    {
        feature: 'answers',
        description: "Enable the answers AI system to ask questions directly from your document repository.",
    }

]

/**
 * Get all features form the feature registry
 */
export function useFeaturesRegistry() {
    return REGISTRY;
}

function useFeatureEnabledFromRegistry(featureName: FeatureName) {

    return React.useMemo(() => {
        return arrayStream(REGISTRY)
                .filter(current => current.feature === featureName)
                .first()?.enabledByDefault
    }, [featureName])

}

export function useFeatureEnabled(featureName: FeatureName) {

    const featureEnabledFromRegistry = useFeatureEnabledFromRegistry(featureName);

    const prefs = usePrefsContext();

    if (prefs.defined(featureName)) {
        // use whatever is defined in prefs either enabled or disabled as this takes priority.
        return prefs.isMarked(featureName);
    }

    return featureEnabledFromRegistry;

}
