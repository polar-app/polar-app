import React from "react";
import {createFeatureRegistry, FeatureRegistry} from "./FeaturesRegistry";
import {render, screen, waitFor} from "@testing-library/react";
import {assert} from 'chai';

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
        description: ""
    },
};

const [TestFeature] = createFeatureRegistry(DEFAULT_REGISTRY);

describe("FeaturesRegistry", function() {

    let enabled: boolean | undefined = undefined;

    it("Feature enabled", async () => {

        const Enabled = () => {

            React.useEffect(() => {
                // enabledRef.current = true;
                enabled = true;
            }, []);

            return <div>
                ENABLED
            </div>
        }

        const Test = () => {
            return (
                <TestFeature feature={['feature-a']}
                             enabled={<Enabled/>}/>
            );
        }

        render(<Test/>)

        await waitFor(() => screen.getByText("ENABLED"))

        assert.isTrue(enabled);

    });


})
