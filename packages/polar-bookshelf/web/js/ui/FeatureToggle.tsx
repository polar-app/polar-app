import React from 'react';
import {FeatureToggles} from "polar-shared/src/util/FeatureToggles";

export class FeatureToggle extends React.Component<IProps, IState> {

    public render() {

        if (FeatureToggles.get(this.props.name)) {
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
