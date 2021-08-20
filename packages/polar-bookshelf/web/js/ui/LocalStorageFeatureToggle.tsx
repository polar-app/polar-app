import React from 'react';
import {LocalStorageFeatureToggles} from "polar-shared/src/util/LocalStorageFeatureToggles";

export class LocalStorageFeatureToggle extends React.Component<IProps, IState> {

    public render() {

        if (LocalStorageFeatureToggles.get(this.props.name)) {
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
