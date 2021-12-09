import React from "react";
import {createFeatureRegistry, FeatureRegistry} from "./FeaturesRegistry";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {assert} from 'chai';

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

describe("FeaturesRegistry", function() {

    let enabled: boolean | undefined = undefined;

    it("Feature enabled", async () => {

        const FeatureEnabled = () => {
            //
            // React.useEffect(() => {
            //     // enabledRef.current = true;
            //     enabled = true;
            // }, []);

            return <div>
                ENABLED
            </div>
        }

        const Test = () => {
            return (
                <TestFeature features={['feature-a']}
                             enabled={<FeatureEnabled/>}/>
            );
        }

        render(<Test/>)

        await waitFor(() => screen.getByText("ENABLED"))

        // assert.isTrue(enabled);

    });


})
