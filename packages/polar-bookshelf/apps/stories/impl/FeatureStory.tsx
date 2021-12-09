import {createFeatureRegistry, FeatureRegistry} from "../../../web/js/features/FeaturesRegistry";
import React from "react";


type TestFeatureName = 'feature-a' | 'feature-b' | 'feature-c';

const DEFAULT_REGISTRY: FeatureRegistry<TestFeatureName>= {
    "feature-a": {
        description: "",
        enabled: true
    },
    "feature-b": {
        description: ""
    },
    "feature-c": {
        description: ""
    },
};

const [TestFeature] = createFeatureRegistry(DEFAULT_REGISTRY);

const FeatureEnabled = () => {

    return <div>
        ENABLED
    </div>

}
export const FeatureStory = () => {

    return (
        <TestFeature features={['feature-a']} enabled={<FeatureEnabled/>}/>
    )

}
