import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import {FeatureName, useFeatureToggler} from "../../features/FeaturesRegistry";

export const EnableFeatureToggle = () => {

    const featureToggler = useFeatureToggler();

    React.useEffect(() => {

        const url = new URL(document.location.href);

        const feature = url.searchParams.get('name')
        const state = url.searchParams.get('state');

        if (feature) {

            console.log("Enabling feature toggle: " + feature);

            featureToggler(feature as FeatureName, ! state || state !== 'off')
                .then(() => document.location.href = '/')
                .catch(err => console.error(err));

        } else {
            console.warn("No feature to toggle: ");
        }

    }, [featureToggler]);

    return (
        <LinearProgress />
    );

}


