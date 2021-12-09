import React from "react";
import {FeatureRegistry, RegistryContext} from "./FeaturesRegistry";
import {render} from "@testing-library/react";

describe("FeaturesRegistry", function() {

    type TestFeatureName = 'feature-a' | 'feature-b' | 'feature-c';

    const DEFAULT_REGISTRY: FeatureRegistry<TestFeatureName>= {
        "feature-a": {
            description: ""
        },
        "feature-b": {
            description: ""
        },
        "feature-c": {
            description: ""
        },
    };

    it("one enabled", () => {

        const Test = () => {
            return (
                <RegistryContext.Provider value={DEFAULT_REGISTRY}>

                </RegistryContext.Provider>
            );
        }

        render(<>)


    });


})
