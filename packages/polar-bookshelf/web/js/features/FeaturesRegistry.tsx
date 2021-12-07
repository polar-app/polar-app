
export type FeatureName = 'design-m0';

interface IFeature {

    readonly name: FeatureName;

    readonly description: string;

    /**
     * This feature is enabled by default for everyone.
     */
    readonly enabledByDefault?: true;

}

const FEATURES: ReadonlyArray<IFeature> = [
    {
        name: 'design-m0',
        description: "Design milestone 0",
    }
]

/**
 * Get all features form the feature registry
 */
export function useFeaturesRegistry() {
    return FEATURES;
}

export function useFeatureEnabled(feature: FeatureName) {
    return false;
}

export function useFeatureDisabled(feature: FeatureName) {
    return false;
}
