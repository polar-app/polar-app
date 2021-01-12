import * as React from 'react';
import {useSideNavStore} from "./SideNavStore";
import {Arrays} from "polar-shared/src/util/Arrays";
import {PersistentRoute} from "../apps/repository/PersistentRoute";

export const SideNavContentRouter = React.memo(() => {
    const {tabs, activeTab} = useSideNavStore(['tabs', 'activeTab']);

    const tab = Arrays.first(tabs.filter(tab => tab.id === activeTab));

    if (! tab) {
        return null;
    }

    return (
        <PersistentRoute exact path={tab.url}>
            <>
                {tab.content}
            </>
        </PersistentRoute>
    );

});