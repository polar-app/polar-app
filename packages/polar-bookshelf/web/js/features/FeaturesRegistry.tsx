import React from 'react';
import {usePrefsContext} from "../../../apps/repository/js/persistence_layer/PrefsContext2";
import {mapStream} from "polar-shared/src/util/ArrayStreams";

export type FeatureName = 'design-m0' | 'note-stack' | 'answers';

export type FeatureNameArray<F> = ReadonlyArray<F>;

export interface IFeature {

    readonly description: string;

    /**
     * This feature is enabled by default for everyone.
     */
    readonly enabledByDefault?: true;

}

export type FeatureRegistry<F extends string> = Readonly<{[key in F]: IFeature}>

const DEFAULT_REGISTRY: FeatureRegistry<FeatureName> = {

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
export const RegistryContext = React.createContext<FeatureRegistry<FeatureName>>(DEFAULT_REGISTRY);

/**
 * Get all features form the feature registry
 */
export function useFeaturesRegistry(): FeatureRegistry<FeatureName> {
    return React.useContext(RegistryContext);
}

export function _featureEnabledFromRegistry(features: FeatureNameArray<string>, registry: Readonly<{[key: string]: IFeature}>): boolean {

    // TODO: the types of this aren't really perfect.

    return mapStream(registry)
        .filter(current => features.includes(current.key))
        .first()?.value.enabledByDefault || false;

}

function useFeatureEnabledFromRegistry(features: FeatureNameArray<FeatureName>): boolean {

    const registry = useFeaturesRegistry();

    return React.useMemo(() => {

        return _featureEnabledFromRegistry(features, registry)

    }, [features, registry])

}

export function useFeatureEnabled(features: FeatureNameArray<FeatureName>): boolean {

    const featureEnabledFromRegistry = useFeatureEnabledFromRegistry(features);

    const prefs = usePrefsContext();

    for(const feature of features) {
        if (prefs.defined(feature)) {
            // use whatever is defined in prefs either enabled or disabled as this takes priority.
            return prefs.isMarked(feature);
        }
    }

    return featureEnabledFromRegistry;

}
