import React from 'react';
import {BrowserTabsList} from "./BrowserTabsList";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";
import {BrowserTabContents} from './BrowserTabContents';

interface IProps {
    readonly children: React.ReactElement;
}

export const BrowserTabs = React.memo(function BrowserTabs(props: IProps) {

    if (! AppRuntime.isElectron()) {
        // don't do anything if we're not running electron
        return props.children;
    }

    return (
        <>
            <BrowserTabsList/>
            <BrowserTabContents/>
            {props.children}
        </>
    );

})
