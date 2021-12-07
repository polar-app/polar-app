import React from 'react';
import {usePrefsContext} from "../../../apps/repository/js/persistence_layer/PrefsContext2";

export type FeatureName = 'design-m0' | 'note-stack' | 'answers';

/**
 * A set of features, any of which can trigger the feature.
 */
export type FeatureNameSet = FeatureName | ReadonlyArray<FeatureName>;

interface IFeature {

    readonly description: string;

    /**
     * This feature is enabled by default for everyone.
     */
    readonly enabledByDefault?: true;

}

export type FeatureRegistry = Readonly<Record<FeatureName, IFeature>>;

const DEFAULT_REGISTRY: FeatureRegistry = {

    "design-m0": {
        description: "Design milestone 0",
    },
    "note-stack": {
        description: "Enable the new notes stack which allows the user to view pages visually as a horizontal stack.",
    },
    "answers": {
        description: "Enable the answers AI system to ask questions directly from your document repository.",
    }

};

/**
 * Context for the registry so that we can change this during tests.
 */
const RegistryContext = React.createContext<FeatureRegistry>(DEFAULT_REGISTRY);

/**
 * Get all features form the feature registry
 */
export function useFeaturesRegistry(): FeatureRegistry {
    return React.useContext(RegistryContext);
}

export function _featureEnabledFromRegistry(feature: FeatureNameSet, registry: FeatureRegistry): boolean {

    // const foo = Object.keys(registry);

    // const foo = mapStream<IFeature>(registry);

    // return mapStream(registry)
    //     .filter(current => feature.includes(current.key))
    //     .first()?.enabledByDefault || false;

}

function useFeatureEnabledFromRegistry(feature: FeatureNameSet): boolean {

    const registry = useFeaturesRegistry();

    return React.useMemo(() => {

        return _featureEnabledFromRegistry(feature, registry)

    }, [feature, registry])

}

export function useFeatureEnabled(feature: FeatureName): boolean {

    const featureEnabledFromRegistry = useFeatureEnabledFromRegistry(feature);

    const prefs = usePrefsContext();

    if (prefs.defined(feature)) {
        // use whatever is defined in prefs either enabled or disabled as this takes priority.
        return prefs.isMarked(feature);
    }

    return featureEnabledFromRegistry;

}
