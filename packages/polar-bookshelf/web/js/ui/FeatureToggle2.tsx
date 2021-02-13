import React from 'react';
import {usePrefsContext} from "../../../apps/repository/js/persistence_layer/PrefsContext2";

interface IProps {
    readonly name: string;
    readonly children: JSX.Element;
}

export const FeatureToggle2 = React.memo((props: IProps) => {

    const prefs = usePrefsContext();

    if (prefs.isMarked(props.name)) {
        return props.children;
    }

    return null;

});
