import React from 'react';
import {FeatureToggles} from "./FeatureToggles";

export class FeatureToggle extends React.Component<IProps, IState> {

    public render() {

        if (FeatureToggles.isEnabled(this.props.name)) {
            return this.props.children;
        }

        return [];

    }

}

interface IProps {
    readonly name: string;
}

interface IState {
}
