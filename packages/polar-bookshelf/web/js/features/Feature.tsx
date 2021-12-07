import React from 'react';
import {FeatureName, useFeatureEnabled} from './FeaturesRegistry';
import {deepMemo} from "../react/ReactUtils";

interface IProps {
    readonly feature: FeatureName;
    readonly enabled?: JSX.Element;
    readonly disabled?: JSX.Element;
}

export const Feature = deepMemo((props: IProps) => {

    const featureEnabled = useFeatureEnabled(props.feature);

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
