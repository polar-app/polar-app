import React from 'react';
import {FeatureToggleLocalStorage} from "polar-shared/src/util/FeatureToggleLocalStorage";

export class FeatureToggle extends React.Component<IProps, IState> {

    public render() {

        if (FeatureToggleLocalStorage.get(this.props.name)) {
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
