import React from 'react';
import {useFirestorePrefs} from "../../../apps/repository/js/persistence_layer/FirestorePrefs";
import {mapStream} from "polar-shared/src/util/ArrayStreams";
import {deepMemo} from "../react/ReactUtils";


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
    },
    "dev": {
        title: "Development",
        description: "Enable various tools for developers.",
    },
    "spaced-rep-purge": {
        title: "Spaced Repetition Purge",
        description: "Enable the ability for users to purge their spaced repetition data.",
    },
    "handheld-area-highlights": {
        title: "Handheld Area Highlights",
        description: "Enable area highlights on handheld devices.",
    },
    "legacy-anki-sync": {
        title: "Legacy Anki Sync",
        description: "Enable anki deck downloads.",
    },
    "new-notes-handheld-breadcrumbs": {
        title: "New Notes Handheld Breadcrumbs",
        description: "Enable the new notes handheld breadcrumbs per updated design.",
    },
    "use-redesign-theme": {
        title: "Use Redesign Theme",
        description: "Use Marcella's super fancy redesign :)",
    }

};

// TODO: we might want to rework this and make FeatureName be keyof
// FeatureRegistry I think.  That would be easier to maintain but requires
// another refactor of the code.

export type FeatureName = 'design-m0' | 'note-stack' | 'answers' | 'features' | 'dev' | 'spaced-rep-purge' | 'handheld-area-highlights' | 'legacy-anki-sync' | 'new-notes-handheld-breadcrumbs' | 'use-redesign-theme';

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


export const [Feature, FeatureEnabled, FeatureDisabled, useFeatureEnabled, useFeaturesRegistry, useFeatureToggler] = createFeatureRegistry(DEFAULT_REGISTRY);

interface FeatureProps<F extends string> {
    readonly feature: FeatureNameArrayLike<F>;
    readonly enabled?: JSX.Element;
    readonly disabled?: JSX.Element;
}

interface FeatureEnabledProps<F extends string> {
    readonly feature: FeatureNameArrayLike<F>;
    readonly children: JSX.Element;
}

interface FeatureDisabledProps<F extends string> {
    readonly feature: FeatureNameArrayLike<F>;
    readonly children: JSX.Element;
}

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
type UseFeatureToggler<F> = () => (feature: F, enabled: boolean) => Promise<void>;

type FeatureRegistryTuple<F extends string> = readonly [
    React.FC<FeatureProps<F>>,
    React.FC<FeatureEnabledProps<F>>,
    React.FC<FeatureDisabledProps<F>>,
    UseFeatureEnabled<F>,
    UseFeaturesRegistry<F>,
    UseFeatureToggler<F>
];

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

        const prefs = useFirestorePrefs();

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

    const FeatureEnabled = deepMemo((props: FeatureEnabledProps<F>) => {
        return (
            <Feature feature={props.feature} enabled={props.children}/>
        )
    });

    const FeatureDisabled = deepMemo((props: FeatureDisabledProps<F>) => {
        return (
            <Feature feature={props.feature} disabled={props.children}/>
        )
    });

    function useFeatureToggler() {

        const prefs = useFirestorePrefs();

        return React.useCallback(async (featureName: F, enabled: boolean = true) => {
            prefs.mark(featureName, enabled);
            await prefs.commit();
        }, [prefs]);

    }

    return [Feature, FeatureEnabled, FeatureDisabled, useFeatureEnabled, useFeaturesRegistry, useFeatureToggler];

}

