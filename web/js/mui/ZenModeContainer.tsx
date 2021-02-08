import * as React from 'react';
import { useZenModeStore } from './ZenModeStore';

interface IProps {
    readonly children: JSX.Element;
}

/**
 * Listen to the zen mode settings and toggle containers on/off when the user
 * toggles zen mode.
 */
export const ZenModeContainer = React.memo((props: IProps) => {

    const {zenMode} = useZenModeStore(['zenMode']);

    if (zenMode) {
        return props.children;
    }

    return null;

})
