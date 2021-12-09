import React from 'react';
import {usePrefsContext} from "../../../apps/repository/js/persistence_layer/PrefsContext2";
import {mapStream} from "polar-shared/src/util/ArrayStreams";
import {deepMemo} from "../react/ReactUtils";

export type FeatureName = 'design-m0' | 'note-stack' | 'answers' | 'features';

export type FeatureNameArray<F> = ReadonlyArray<F>;

export type FeatureNameArrayLike<F> = F | ReadonlyArray<F>;

export type FeatureRegistry<F extends string> = Readonly<{[key in F]: IFeature}>

const DEFAULT_REGISTRY: FeatureRegistry<FeatureName> = {

    "features": {
        title: "Feature Toggles",
        description: "Enables the ability to enable/disable new and experimental features that we're actively working on but that are not yet ready for production.",
    },

    "design-m0": {
        title: "Design Milestone 0",
        description: "Design milestone 0 which combines multiple feature tags to show this design milestone as an atomic unit.",
    },
    "note-stack": {
        title: "Notes Stack",
        description: "Enable the new notes stack which allows the user to view pages visually as a horizontal stack.",
    },
    "answers": {
        title: "AI Answers",
        description: "Enable the answers AI system to ask questions directly from your document repository.",
    }

};


export interface IFeature {

    readonly title: string;

    readonly description: string;

    /**
     * This feature is enabled by default for everyone.
     */
    readonly enabled?: boolean;

}

function _featureEnabledFromRegistry(features: FeatureNameArray<string>, registry: Readonly<{[key: string]: IFeature}>): boolean {

    // TODO: the types of this aren't really perfect.

    return mapStream(registry)
        .filter(current => features.includes(current.key))
        .filter(current => current.value.enabled === true)
        .first()?.value.enabled || false;

}


interface FeatureProps<F extends string> {
    readonly feature: FeatureNameArrayLike<F>;
    readonly enabled?: JSX.Element;
    readonly disabled?: JSX.Element;
}

export const [Feature, useFeatureEnabled, useFeaturesRegistry] = createFeatureRegistry(DEFAULT_REGISTRY);

/**
 * Return true if a feature is enabled.
 */
type UseFeatureEnabled<F> = (features: FeatureNameArrayLike<F>) => boolean;

/**
 * Gives us access to the whole registry.
 */
type UseFeaturesRegistry<F extends string> = () => FeatureRegistry<F>;

/**
 * Gives us access to a toggler that can turn on or off a specific feature.
 */
type UseFeatureToggler<F> = () => (feature: F, enabled: boolean) => void;

type FeatureRegistryTuple<F extends string> = readonly [
    React.FC<FeatureProps<F>>,
    UseFeatureEnabled<F>,
    UseFeaturesRegistry<F>,
    UseFeatureToggler<F>
]

export function createFeatureRegistry<F extends string>(registry: FeatureRegistry<F>): FeatureRegistryTuple<F> {

    function toFeaturesArray(feature: FeatureNameArrayLike<F>): ReadonlyArray<F> {

        if (typeof feature === 'string') {
            return [feature];
        }

        return feature;

    }

    /**
     *
     * Context for the registry so that we can change this during tests.
     */
    const RegistryContext = React.createContext<FeatureRegistry<F>>(registry);

    /**
     * Get all features form the feature registry
     */
    function useFeaturesRegistry(): FeatureRegistry<F> {
        return React.useContext(RegistryContext);
    }

    function useFeatureEnabledFromRegistry(features: FeatureNameArray<F>): boolean {

        const registry = useFeaturesRegistry();

        return React.useMemo(() => {

            return _featureEnabledFromRegistry(features, registry)

        }, [features, registry])

    }

    function useFeatureEnabled(feature: FeatureNameArrayLike<F>): boolean {

        const features = toFeaturesArray(feature);

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

    const Feature = deepMemo((props: FeatureProps<F>) => {

        const features = toFeaturesArray(props.feature)

        const featureEnabled = useFeatureEnabled(features);

        if (featureEnabled) {

            if (props.enabled) {
                return props.enabled;
            }

        } else {

            if (props.disabled) {
                return props.disabled;
            }

        }

        return null;

    });

    function useFeatureToggler() {

        const prefs = usePrefsContext();

        return React.useCallback(async (featureName: F, enabled: boolean = true) => {
            prefs.mark(featureName, enabled);
            await prefs.commit();
        }, [prefs]);

    }

    return [Feature, useFeatureEnabled, useFeaturesRegistry, useFeatureToggler];

}

