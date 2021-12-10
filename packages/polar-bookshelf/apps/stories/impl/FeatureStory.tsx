import {createFeatureRegistry, FeatureRegistry} from "../../../web/js/features/FeaturesRegistry";
import React from "react";


type TestFeatureName = 'feature-a' | 'feature-b' | 'feature-c';

const DEFAULT_REGISTRY: FeatureRegistry<TestFeatureName>= {
    "feature-a": {
        title: "Feature A",
        description: "",
        enabled: true
    },
    "feature-b": {
        title: "Feature B",
        description: ""
    },
    "feature-c": {
        title: "Feature C",
        description: "",
        enabled: true
    },
};

const [TestFeature] = createFeatureRegistry(DEFAULT_REGISTRY);

const FeatureEnabled = () => {

    return <div>
        ENABLED
    </div>

}

const FeatureDisabled = () => {

    return <div>
        DISABLED
    </div>

}

export const FeatureStory = () => {

    return (
        <div>

            <h2>
                Feature with one channel which is enabled.
            </h2>
            <TestFeature feature='feature-a'
                         enabled={<FeatureEnabled/>}
                         disabled={<FeatureDisabled/>}/>


            <h2>
                Feature with one channel which is disabled.
            </h2>
            <TestFeature feature='feature-b'
                         enabled={<FeatureEnabled/>}
                         disabled={<FeatureDisabled/>}/>

            <h2>
                Feature with two channels but only one is enabled.
            </h2>
            <TestFeature feature={['feature-c', 'feature-b']}
                         enabled={<FeatureEnabled/>}
                         disabled={<FeatureDisabled/>}/>

        </div>
    )

}
