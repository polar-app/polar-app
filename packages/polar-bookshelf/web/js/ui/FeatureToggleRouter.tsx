import React from 'react';
import {FeatureToggles} from "polar-shared/src/util/FeatureToggles";

interface IProps {
    readonly name: string;
    readonly enabled: JSX.Element;
    readonly disabled: JSX.Element;
}

export const FeatureToggleRouter = (props: IProps) => {

    const {name} = props;

    const isEnabled = FeatureToggles.get(name);

    console.log(`FIXME: ${name} isEnabled: ${isEnabled}`);

    if (isEnabled) {
        return props.enabled;
    } else {
        return props.disabled;
    }

};
