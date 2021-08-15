import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import {useFeatureToggler} from "../../../../apps/repository/js/persistence_layer/PrefsContext2";

export const EnableFeatureToggle = () => {

    const featureToggler = useFeatureToggler();

    React.useEffect(() => {

        const url = new URL(document.location.href);

        const feature = url.searchParams.get('name')

        if (feature) {

            console.log("Enabling feature toggle: " + feature);

            // note that we MAY need to shutdown Firestore due to that Safari
            // bug but it might be fixed by now.

            featureToggler(feature)
                .then(() => document.location.href = '/')
                .catch(err => console.error(err));

        } else {
            console.warn("No feature to toggle: ");
        }

    })

    return (
        <LinearProgress />
    );

}

