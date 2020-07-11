import React from 'react';
import {BrowserTabsStoreProvider} from './BrowserTabsStore';
import {BrowserTabsList} from "./BrowserTabsList";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";

interface IProps {
    readonly children: React.ReactElement;
}

export const BrowserTabs = React.memo((props: IProps) => {

    if (! AppRuntime.isElectron()) {
        // don't do anything if we're not running electron
        return props.children;
    }

    return (
        <BrowserTabsStoreProvider>
            <>
                <BrowserTabsList/>
                {props.children}
            </>
        </BrowserTabsStoreProvider>
    );

})
