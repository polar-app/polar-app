import * as React from 'react';
import {useSideNavStore} from "./SideNavStore";
import {Arrays} from "polar-shared/src/util/Arrays";

export const SideNavContent = React.memo(() => {
    const {tabs, activeTab} = useSideNavStore(['tabs', 'activeTab']);

    const tab = Arrays.first(tabs.filter(tab => tab.id === activeTab));

    if (! tab) {
        return null;
    }

    return (
        <>
            {tab.content}
        </>
    );

});